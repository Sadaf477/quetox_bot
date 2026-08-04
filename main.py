import os
import requests
from flask import Flask, request

app = Flask(__name__)

TOKEN = os.environ.get("TOKEN")
PREMIUM_LINK = os.environ.get("PREMIUM_LINK")

@app.route('/postback')
def postback():
    try:
        amount = float(request.args.get('sumdep', 0))
        user_id = request.args.get('user_id')
        
        if not user_id:
            return "Error: No user_id"
        
        if amount >= 50:
            msg = f"Congrats! ${amount} deposit hogaya 🎉\nPremium Access: {PREMIUM_LINK}"
            r = requests.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", 
                          data={"chat_id": user_id, "text": msg}, timeout=10)
            print(r.text) # Log me response dikhega
            return "OK - DM Sent"
        else:
            return "OK - Less than 50"
    except Exception as e:
        print("ERROR:", e)
        return f"Error: {e}"

@app.route('/')
def home():
    return "Bot is running"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
