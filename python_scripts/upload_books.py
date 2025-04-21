from requests import get, post
import pandas as pd
import os
import time

url_details = "http://localhost:6199/books/details"
url_abstract = "http://localhost:6199/books/abstract"
url_add = "http://localhost:6199/books/add"
book_lists_dir = "book_lists"

delay_between_requests = 5

for filename in os.listdir(book_lists_dir):
    if filename.endswith(".csv"):
        filepath = os.path.join(book_lists_dir, filename)
        category = filename.replace(".csv", "").replace("_", " ").strip()
        try:
            df = pd.read_csv(filepath)
            for index, row in df.iterrows():
                author = row['Author']
                title = row['Title']
                price_str = row['Price']
                quantity = row['Amount']

                try:
                    price = float(price_str.replace("R", "").strip())
                except ValueError:
                    print(f"Warning: Could not convert price '{price_str}' for '{title}' to a number. Setting price to 0.")
                    price = 0.0

                params = {
                    "author": author,
                    "title": title
                }

                try:
                    response = get(url=url_details, params=params)
                    print(f"Status code for '{title}': {response.status_code}")
                    if response.status_code == 200:
                        data = response.json()[0]
                        abstract_response = get(url=url_abstract, params=params)
                        abstract_data = abstract_response.json()
                        abstract = abstract_data.get('abstract', 'No abstract found.')
                        author_name = data['author_name'][0]
                        cover_i = data.get('cover_i')
                        isbn = data.get('isbn', 'N/A')
                        publish_year = data['publish_year'][0]

                        new_body = {
                            "cover_id": cover_i,
                            "title": title,
                            "author": author_name,
                            "publish_year": publish_year,
                            "abstract": abstract,
                            "quantity": quantity,
                            "price": price,
                            "isbn": isbn,
                            "category": category
                        }
                        post(url=url_add, json=new_body)
                        print(f"Prepared data for '{title}': {new_body}")
                    else:
                        print(f"Failed to retrieve details for '{title}'. Status code: {response.status_code}")
                except Exception as e:
                    print(f"An error occurred while processing '{title}': {e}")

                time.sleep(delay_between_requests)

        except FileNotFoundError:
            print(f"Error: File not found at {filepath}")
        except pd.errors.EmptyDataError:
            print(f"Warning: {filepath} is empty.")
        except Exception as e:
            print(f"An error occurred while reading {filepath}: {e}")

print("Processing of all CSV files complete.")