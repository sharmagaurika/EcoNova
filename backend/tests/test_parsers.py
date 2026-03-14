import requests
import json

def test_bank_parser():
    url = "http://localhost:8000/parse/bank"
    
    csv_data = "Description,Amount\nShell Service Station,55.00\nUber Trip,22.40"
    
    payload = {"data": csv_data}
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, data=json.dumps(payload), headers=headers)
    
    if response.status_code == 200:
        print("Success!")
        data = response.json()
        print(f"Total CO2: {data['total_kg_co2']}kg")
        for item in data['items']:
            print(f"Item: {item['description']} | CO2: {item['kg_co2']}kg")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_bank_parser()
