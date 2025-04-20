from requests import get, post

url = "http:localhost:6199"
params = {
    "author": "JK Rowling",
    "title": "Harry Potter"
}

response = post(url=url, params=params)