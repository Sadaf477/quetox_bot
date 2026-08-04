import os
import requests
from flask import Flask, request

app = Flask(__name__)

TOKEN = os.environ.get("TOKEN")
PREMIUM_LINK = os.environ.get("PREMIUM_LINK")

@app.route('/postback')
def postback():
    amount = float(request.args.get('sumdep', 0))
    user_id = request.args.get('user_id')
    
    if not user_id:
        return "Error: No user_id"
    
    if amount >= 50:
        msg = f"Congrats! ${amount} deposit hogaya 🎉\nPremium Access: {PREMIUM_LINK}"
        requests.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", 
                      data={"chat_id": user_id, "text": msg})
        return "OK - DM Sent"
    else:
        return "OK - Less than 50"

@app.route('/')
def home():
    return "Bot is running"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
