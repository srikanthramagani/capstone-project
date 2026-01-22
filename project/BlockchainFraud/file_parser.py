"""
Universal File Parser for Transaction Data
Supports: CSV, TXT, PDF with dynamic column mapping
"""
import pandas as pd
import io
import re
from typing import Dict, Optional
import PyPDF2

class FileParser:
    """Parse various file formats and extract transaction data"""
    
    # Accept ANY columns - no specific requirements
    REQUIRED_COLUMNS = []  # Empty - accept all files
    
    @staticmethod
    def parse_csv(file_stream) -> pd.DataFrame:
        """Parse CSV file"""
        try:
            df = pd.read_csv(file_stream)
            print(f"✅ CSV parsed: {len(df)} rows, {len(df.columns)} columns")
            return df
        except Exception as e:
            raise ValueError(f"CSV parsing error: {str(e)}")
    
    @staticmethod
    def parse_txt(file_stream) -> pd.DataFrame:
        """Parse TXT file (comma/tab separated)"""
        try:
            # Try comma-separated first
            content = file_stream.read().decode('utf-8')
            
            # Detect delimiter
            first_line = content.split('\n')[0]
            if '\t' in first_line:
                delimiter = '\t'
            elif ',' in first_line:
                delimiter = ','
            elif '|' in first_line:
                delimiter = '|'
            else:
                delimiter = None
            
            # Parse with detected delimiter
            df = pd.read_csv(io.StringIO(content), delimiter=delimiter)
            print(f"✅ TXT parsed: {len(df)} rows, {len(df.columns)} columns (delimiter: '{delimiter}')")
            return df
        except Exception as e:
            raise ValueError(f"TXT parsing error: {str(e)}")
    
    @staticmethod
    def parse_pdf(file_stream) -> pd.DataFrame:
        """Parse PDF file and extract tabular data"""
        try:
            pdf_reader = PyPDF2.PdfReader(file_stream)
            all_text = ""
            
            # Extract text from all pages
            for page in pdf_reader.pages:
                all_text += page.extract_text() + "\n"
            
            # Try to find table-like structures
            lines = all_text.split('\n')
            
            # Look for lines with multiple numeric values (likely data rows)
            data_lines = []
            header_line = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check if line has multiple columns (spaces or tabs)
                parts = re.split(r'\s{2,}|\t', line)
                if len(parts) >= 3:  # At least 3 columns
                    if header_line is None:
                        header_line = parts
                    else:
                        data_lines.append(parts)
            
            if not data_lines:
                raise ValueError("No tabular data found in PDF")
            
            # Create DataFrame
            df = pd.DataFrame(data_lines, columns=header_line if header_line else None)
            
            # Try to convert numeric columns
            for col in df.columns:
                try:
                    df[col] = pd.to_numeric(df[col], errors='ignore')
                except:
                    pass
            
            print(f"✅ PDF parsed: {len(df)} rows extracted from {len(pdf_reader.pages)} pages")
            return df
            
        except Exception as e:
            raise ValueError(f"PDF parsing error: {str(e)}")
    
    @staticmethod
    def validate_columns(df: pd.DataFrame) -> Dict:
        """Validate and map columns"""
        missing = [col for col in FileParser.REQUIRED_COLUMNS if col not in df.columns]
        
        # Try fuzzy matching for common variations
        column_mapping = {}
        for required in FileParser.REQUIRED_COLUMNS:
            if required not in df.columns:
                # Look for similar column names
                for col in df.columns:
                    col_lower = col.lower().replace('_', '').replace(' ', '')
                    req_lower = required.lower().replace('_', '').replace(' ', '')
                    if req_lower in col_lower or col_lower in req_lower:
                        column_mapping[col] = required
                        break
        
        # Apply mapping
        if column_mapping:
            df = df.rename(columns=column_mapping)
            missing = [col for col in FileParser.REQUIRED_COLUMNS if col not in df.columns]
        
        return {
            'valid': len(missing) == 0,
            'missing_columns': missing,
            'available_columns': list(df.columns),
            'mapped_columns': column_mapping,
            'dataframe': df
        }
    
    @staticmethod
    def parse_file(file_obj, filename: str) -> Dict:
        """Universal file parser - automatically detect format"""
        print(f"\n{'='*80}")
        print(f"📄 PARSING FILE: {filename}")
        print(f"{'='*80}")
        
        file_ext = filename.lower().split('.')[-1]
        
        try:
            # Parse based on file extension
            if file_ext == 'csv':
                df = FileParser.parse_csv(file_obj)
            elif file_ext in ['txt', 'tsv']:
                df = FileParser.parse_txt(file_obj)
            elif file_ext == 'pdf':
                df = FileParser.parse_pdf(file_obj)
            else:
                # Try CSV as default
                df = FileParser.parse_csv(file_obj)
            
            # Validate columns
            validation = FileParser.validate_columns(df)
            
            if not validation['valid']:
                print(f"⚠️ Missing required columns: {validation['missing_columns']}")
                print(f"📋 Available columns: {validation['available_columns']}")
            else:
                print(f"✅ All required columns present")
            
            return {
                'success': validation['valid'],
                'dataframe': validation['dataframe'],
                'total_rows': len(df),
                'columns': list(df.columns),
                'missing_columns': validation['missing_columns'],
                'mapped_columns': validation['mapped_columns']
            }
            
        except Exception as e:
            print(f"❌ File parsing failed: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'dataframe': None
            }
