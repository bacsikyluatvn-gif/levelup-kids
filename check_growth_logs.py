
import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

family_id = "fb13768f-6246-4a41-863a-bb574d75f284" # I need to find the actual family_id

# Let's try to find the family_id from profiles
profiles = supabase.table("profiles").select("*").execute()
if profiles.data:
    family_id = profiles.data[0]['family_id']
    print(f"Found family_id: {family_id}")

requests = supabase.table("requests").select("*").eq("family_id", family_id).execute()
print(f"Total requests: {len(requests.data)}")
growth_logs = [r for r in requests.data if r['type'] in ['behavior_good', 'behavior_bad']]
print(f"Growth logs count: {len(growth_logs)}")
for log in growth_logs:
    print(f" - {log['item_title']} ({log['type']})")
