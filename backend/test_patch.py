import urllib.request
import urllib.parse
import json

def request(url, method="GET", data=None, headers=None):
    if headers is None: headers = {}
    if data is not None:
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')

# Login
status, res = request("http://localhost:8000/auth/login", method="POST", headers={"Content-Type": "application/x-www-form-urlencoded"}, data=None) # Wait, login is form data
# actually just let's rewrite the login part
data = urllib.parse.urlencode({"username": "testuser", "password": "password"}).encode('utf-8')
req = urllib.request.Request("http://localhost:8000/auth/login", data=data, method="POST")
try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    # try registering
    register_data = json.dumps({"username": "testuser", "email": "test@test.com", "password": "password"}).encode('utf-8')
    req2 = urllib.request.Request("http://localhost:8000/auth/signup", data=register_data, headers={'Content-Type': 'application/json'}, method="POST")
    try:
        urllib.request.urlopen(req2)
    except: pass
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode('utf-8'))

token = res.get("access_token")

# Now patch
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
patch_data = {"modulesTaken": ["CS1010S"], "modulesToTake": ["CS2030S"]}
req3 = urllib.request.Request("http://localhost:8000/profile/me", data=json.dumps(patch_data).encode('utf-8'), headers=headers, method="PATCH")
try:
    with urllib.request.urlopen(req3) as response:
        print("PATCH STATUS:", response.status)
        print("PATCH RESPONSE:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("PATCH STATUS:", e.code)
    print("PATCH RESPONSE:", e.read().decode('utf-8'))
