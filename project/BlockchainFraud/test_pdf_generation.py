"""
Test PDF Report Generation
"""
import requests
import os

print("Testing PDF report generation...")

try:
    response = requests.get('http://localhost:5000/analytics/generate-pdf-report', timeout=30)
    
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    print(f"PDF Size: {len(response.content)} bytes")
    
    if response.status_code == 200:
        # Save PDF to test file
        test_file = "test_report.pdf"
        with open(test_file, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ PDF saved to: {os.path.abspath(test_file)}")
        print("✅ PDF report generation working!")
        
        # Check file size
        file_size = os.path.getsize(test_file)
        print(f"File size: {file_size:,} bytes")
        
        if file_size > 1000:
            print("✅ PDF has content (size > 1KB)")
        else:
            print("⚠️ PDF might be empty or have issues")
    else:
        print(f"❌ Failed with status {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
