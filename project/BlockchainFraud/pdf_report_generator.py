"""
PDF Report Generator for Fraud Detection System
Generates comprehensive PDF reports with charts, statistics, and flagged transactions
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
from datetime import datetime
import os

class FraudDetectionReportPDF:
    def __init__(self, filename="fraud_detection_report.pdf"):
        self.filename = filename
        self.doc = SimpleDocTemplate(filename, pagesize=letter)
        self.styles = getSampleStyleSheet()
        self.story = []
        self.width, self.height = letter
        
        # Custom styles
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e3c72'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2a5298'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=10,
            leading=14
        )

    def add_title(self, title="Fraud Detection System - Analytics Report"):
        """Add main title"""
        self.story.append(Paragraph(title, self.title_style))
        self.story.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", self.normal_style))
        self.story.append(Spacer(1, 0.3*inch))

    def add_section_header(self, text):
        """Add section header"""
        self.story.append(Spacer(1, 0.2*inch))
        self.story.append(Paragraph(text, self.heading_style))
        self.story.append(Spacer(1, 0.1*inch))

    def add_metrics_table(self, metrics_data):
        """Add system metrics table"""
        data = [
            ['Metric', 'Value', 'Details'],
            ['Total Transactions', metrics_data.get('totalTransactions', {}).get('value', '0'), 
             metrics_data.get('totalTransactions', {}).get('subtitle', 'N/A')],
            ['Total Users', metrics_data.get('totalUsers', {}).get('value', '0'),
             metrics_data.get('totalUsers', {}).get('subtitle', 'N/A')],
            ['Fraudulent Transactions', metrics_data.get('fraudulentTransactions', {}).get('value', '0'),
             metrics_data.get('fraudulentTransactions', {}).get('subtitle', 'N/A')],
            ['Model Accuracy', metrics_data.get('modelAccuracy', {}).get('value', '0%'),
             metrics_data.get('modelAccuracy', {}).get('subtitle', 'N/A')]
        ]
        
        table = Table(data, colWidths=[2.5*inch, 1.5*inch, 2.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        self.story.append(table)

    def create_fraud_pie_chart(self, fraud_vs_normal_data):
        """Create fraud vs normal pie chart using matplotlib"""
        labels = fraud_vs_normal_data.get('labels', ['Legitimate', 'Fraudulent'])
        values = fraud_vs_normal_data.get('data', [0, 0])
        
        fig, ax = plt.subplots(figsize=(6, 4))
        colors_pie = ['#00C851', '#ff4444']
        explode = (0, 0.1)
        
        ax.pie(values, explode=explode, labels=labels, colors=colors_pie, autopct='%1.1f%%',
               shadow=True, startangle=90)
        ax.axis('equal')
        ax.set_title('Fraud vs Normal Transactions', fontsize=14, fontweight='bold')
        
        # Save to bytes buffer
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer

    def create_transaction_types_chart(self, transaction_types_data):
        """Create transaction types bar chart"""
        labels = transaction_types_data.get('labels', [])
        normal_values = transaction_types_data.get('normal', [])
        fraud_values = transaction_types_data.get('fraud', [])
        
        fig, ax = plt.subplots(figsize=(8, 5))
        x = range(len(labels))
        width = 0.35
        
        ax.bar([i - width/2 for i in x], normal_values, width, label='Normal', color='#00C851')
        ax.bar([i + width/2 for i in x], fraud_values, width, label='Fraud', color='#ff4444')
        
        ax.set_xlabel('Transaction Type', fontsize=12, fontweight='bold')
        ax.set_ylabel('Count', fontsize=12, fontweight='bold')
        ax.set_title('Transaction Types Analysis', fontsize=14, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels(labels, rotation=45, ha='right')
        ax.legend()
        ax.grid(axis='y', alpha=0.3)
        
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer

    def create_fraud_trend_chart(self, fraud_trend_data):
        """Create fraud trend line chart"""
        labels = fraud_trend_data.get('labels', [])
        fraud_rates = fraud_trend_data.get('fraudRate', [])
        total_txns = fraud_trend_data.get('totalTransactions', [])
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 6))
        
        # Fraud rate trend
        ax1.plot(labels, fraud_rates, marker='o', color='#ff4444', linewidth=2)
        ax1.set_title('Fraud Rate Trend', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Fraud Rate (%)', fontsize=10)
        ax1.grid(True, alpha=0.3)
        ax1.set_xticklabels(labels, rotation=45, ha='right')
        
        # Total transactions trend
        ax2.bar(labels, total_txns, color='#33b5e5', alpha=0.7)
        ax2.set_title('Total Transactions per Batch', fontsize=12, fontweight='bold')
        ax2.set_ylabel('Transaction Count', fontsize=10)
        ax2.set_xlabel('Batch ID', fontsize=10)
        ax2.set_xticklabels(labels, rotation=45, ha='right')
        ax2.grid(axis='y', alpha=0.3)
        
        plt.tight_layout()
        
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer

    def add_chart_image(self, img_buffer, width=6*inch):
        """Add chart image to PDF"""
        img = Image(img_buffer, width=width, height=width*0.6)
        self.story.append(img)
        self.story.append(Spacer(1, 0.2*inch))

    def add_flagged_transactions_table(self, flagged_transactions, max_rows=50):
        """Add flagged transactions table"""
        if not flagged_transactions:
            self.story.append(Paragraph("No flagged transactions found.", self.normal_style))
            return
        
        # Prepare data
        data = [['#', 'TX ID', 'Amount', 'From', 'To', 'Type']]
        
        for i, tx in enumerate(flagged_transactions[:max_rows], 1):
            data.append([
                str(i),
                str(tx.get('transactionId', 'N/A'))[:15] + '...',
                f"${tx.get('amount', 0):.2f}",
                str(tx.get('sender', 'N/A'))[:10] + '...',
                str(tx.get('receiver', 'N/A'))[:10] + '...',
                str(tx.get('transactionType', 'N/A'))
            ])
        
        table = Table(data, colWidths=[0.4*inch, 1.3*inch, 0.9*inch, 1.1*inch, 1.1*inch, 0.9*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ff4444')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))
        
        self.story.append(table)
        
        if len(flagged_transactions) > max_rows:
            self.story.append(Spacer(1, 0.1*inch))
            self.story.append(Paragraph(
                f"<i>Showing top {max_rows} of {len(flagged_transactions)} flagged transactions</i>",
                self.normal_style
            ))

    def add_blockchain_status(self, blockchain_status, recent_blocks):
        """Add blockchain status section"""
        status_text = f"""
        <b>Status:</b> {blockchain_status.get('label', 'Unknown')}<br/>
        <b>Last Sync:</b> {blockchain_status.get('lastSync', 'N/A')}<br/>
        <b>Total Blocks:</b> {blockchain_status.get('totalBlocks', 0)}<br/>
        <b>Recent Blocks:</b> {len(recent_blocks)}
        """
        
        self.story.append(Paragraph(status_text, self.normal_style))
        self.story.append(Spacer(1, 0.1*inch))
        
        if recent_blocks:
            # Add recent blocks table
            data = [['Block Number', 'Transactions', 'Fraud Count', 'Timestamp']]
            for block in recent_blocks[:5]:
                data.append([
                    str(block.get('blockNumber', 'N/A'))[:20],
                    str(block.get('transactionCount', 0)),
                    str(block.get('fraudCount', 0)),
                    str(block.get('timestamp', 'N/A'))[:19]
                ])
            
            table = Table(data, colWidths=[2.2*inch, 1.2*inch, 1.2*inch, 1.9*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#33b5e5')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
            ]))
            
            self.story.append(table)

    def generate(self, report_data):
        """Generate the complete PDF report"""
        # Title
        self.add_title()
        
        # System Metrics
        self.add_section_header("📊 System Metrics")
        self.add_metrics_table(report_data.get('metrics', {}))
        
        # Fraud vs Normal Chart
        self.add_section_header("📈 Fraud vs Normal Transactions")
        fraud_chart = self.create_fraud_pie_chart(report_data.get('charts', {}).get('fraudVsNormal', {}))
        self.add_chart_image(fraud_chart, width=5*inch)
        
        # Transaction Types Chart
        self.add_section_header("📊 Transaction Types Analysis")
        types_chart = self.create_transaction_types_chart(report_data.get('charts', {}).get('transactionTypes', {}))
        self.add_chart_image(types_chart, width=6*inch)
        
        # Page break
        self.story.append(PageBreak())
        
        # Fraud Trend Chart
        self.add_section_header("📉 Fraud Trend Analysis")
        trend_chart = self.create_fraud_trend_chart(report_data.get('charts', {}).get('fraudTrend', {}))
        self.add_chart_image(trend_chart, width=6*inch)
        
        # Blockchain Status
        self.add_section_header("⛓️ Blockchain Status")
        self.add_blockchain_status(
            report_data.get('blockchainStatus', {}),
            report_data.get('recentBlocks', [])
        )
        
        # Page break
        self.story.append(PageBreak())
        
        # Flagged Transactions
        self.add_section_header("🚨 Flagged Transactions (Top 50)")
        self.add_flagged_transactions_table(report_data.get('flaggedTransactions', []))
        
        # Build PDF
        self.doc.build(self.story)
        
        return self.filename


def generate_fraud_detection_report(report_data, output_dir="/tmp"):
    """
    Main function to generate PDF report
    
    Args:
        report_data: Dict containing all report data (metrics, charts, flagged transactions, etc.)
        output_dir: Directory to save the PDF file
    
    Returns:
        Path to generated PDF file
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = os.path.join(output_dir, f"fraud_detection_report_{timestamp}.pdf")
    
    pdf_report = FraudDetectionReportPDF(filename)
    pdf_report.generate(report_data)
    
    return filename
