import requests
import json
import os

def test_receipt_image_parser():
    url = "http://localhost:8000/parse/receipt/image"
    script_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(script_dir, "grocery_receipt.jpeg")
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': (image_path, f, 'image/jpeg')}
            headers = {"Authorization": "Bearer dev"} 
            response = requests.post(url, files=files, headers=headers)
            
            if response.status_code == 200:
                print("Success! (Image)")
                data = response.json()
                print(f"Total CO2: {data['total_kg_co2']}kg")
                for item in data['items']:
                    print(f"Item: {item['description']} | CO2: {item['kg_co2']}kg")
            else:
                print(f"Error (Image): {response.status_code}")
                print(response.text)
    except FileNotFoundError:
        print(f"Error: Test image file not found at '{image_path}'. Please provide a valid image.")

def test_bank_parser():
    url = "http://localhost:8000/parse/bank"
    
    csv_data = "Description,Amount\nShell Service Station,55.00\nUber Trip,22.40"
    
    payload = {"data": csv_data}
    headers = {"Content-Type": "application/json","Authorization": "Bearer dev"}

    response = requests.post(url, data=json.dumps(payload), headers=headers)
    
    if response.status_code == 200:
        print("Success! (Bank)")
        data = response.json()
        print(f"Total CO2: {data['total_kg_co2']}kg")
        for item in data['items']:
            print(f"Item: {item['description']} | CO2: {item['kg_co2']}kg")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def test_receipt_text_parser():
    url = "http://localhost:8000/parse/receipt"
    receipt_text = """
    Whole Foods Market
    Beef mince 500g        $12.99
    Oat milk 1L            $3.49
    Chicken breast 1kg     $9.99
    Sourdough bread        $4.50
    Cheddar cheese 200g    $5.99
    """
    payload = {"data": receipt_text}
    headers = {"Content-Type": "application/json", "Authorization": "Bearer dev"}
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    if response.status_code == 200:
        print("Success! (Receipt Text)")
        data = response.json()
        print(f"Total CO2: {data['total_kg_co2']}kg")
        for item in data['items']:
            print(f"Item: {item['description']} | Category: {item['category']} | CO2: {item['kg_co2']}kg | Confidence: {item['confidence']}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_bank_parser()
    test_receipt_image_parser()
    test_receipt_text_parser()
