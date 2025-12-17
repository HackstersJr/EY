import requests
import json
import os
import sys

# n8n configuration
N8N_URL = "http://n8n:5678/api/v1"
API_KEY = "password" # Reusing password as it might be basic auth, but wait...
# Docker compose says:
# N8N_BASIC_AUTH_ACTIVE=true
# N8N_BASIC_AUTH_USER=admin
# N8N_BASIC_AUTH_PASSWORD=password
# But importing usually works via API key or UI.
# However, n8n API might require an API key generated from UI.
# Valid check: Does n8n V1 API use Basic Auth? Yes, if configured.

auth = ("admin", "password")

def import_workflow(file_path):
    with open(file_path, 'r') as f:
        workflow_data = json.load(f)
    
    # POST to /workflows
    try:
        response = requests.post(f"{N8N_URL}/workflows", json=workflow_data, auth=auth)
        if response.status_code == 200:
            wf_id = response.json()['data']['id']
            print(f"Successfully imported workflow ID: {wf_id}")
            
            # Activate it
            activate_response = requests.post(f"{N8N_URL}/workflows/{wf_id}/activate", auth=auth)
            if activate_response.status_code == 200:
                 print("Workflow activated successfully.")
            else:
                 print(f"Failed to activate: {activate_response.text}")
                 
        else:
            print(f"Failed to import: {response.text} (Status: {response.status_code})")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # We will mount the workflow file or copy it.
    # For now, let's paste the JSON content dynamically or read from a mounted path if available.
    # The 'n8n_workflows' folder is NOT volume mounted to backend. 
    # I'll just hardcode the JSON or read it if I map it.
    pass 
