# How to Enable Edit Mode (Change Status & Fields)

## Step 1: Set Your Role to "Lead" in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your **hyperfeeds-tracker** project
3. Go to **SQL Editor** (left sidebar)
4. Click **New query**
5. Paste this SQL command (replace with your actual email):

```sql
update public.profiles 
set role = 'lead' 
where email = 'YOUR-EMAIL@example.com';
```

6. Click **Run** (or press `Ctrl+Enter`)
7. You should see: `Success. No rows returned`

## Step 2: Sign Out and Sign In Again

1. In the tracker app, click **Sign out** (top right)
2. Sign in again with the same email/password
3. Your role will now be "lead"

## Step 3: Use Edit Mode

Once you're signed in as "lead", you'll see:

### Top Right Corner:
- **Blue button**: "✏️ Edit Status & Fields"

### How to Edit:
1. Click the **"✏️ Edit Status & Fields"** button
2. Button turns **green** and says "✓ Done Editing"
3. Yellow banner appears: "✏️ Edit Mode Active — Click any row to edit..."
4. Click any row in Power BI, MES, or other tables
5. A modal opens with editable fields:
   - **Status** (dropdown: PLANNED, IN_PROGRESS, TESTING, DEPLOYED, LIVE, etc.)
   - **Target Date**
   - **Notes**
   - **Progress %** (for tracks)
6. Make your changes
7. Click **Save**
8. Changes are saved immediately and reflected everywhere (Overview, tables, etc.)

### What You Can Edit:
- ✅ **Status** — Change from PLANNED → IN_PROGRESS → TESTING → DEPLOYED → LIVE
- ✅ **Target Date** — Update deadlines
- ✅ **Notes** — Add or update project notes
- ✅ **Progress %** — Update completion percentage
- ✅ **Next Milestone** — Update upcoming milestones

### Changes Reflect Everywhere:
- Overview dashboard (KPIs, status distribution, roadmap)
- Power BI table
- MES table
- Other Initiatives cards
- All charts and summaries

## Troubleshooting

### "Edit button not showing"
- Make sure you're signed in
- Check your role is set to 'lead' in Supabase (Step 1)
- Sign out and sign in again

### "Can't click rows to edit"
- Make sure Edit Mode is active (button should be green)
- Yellow banner should be visible at the top

### "Changes not saving"
- Check browser console for errors (F12)
- Make sure you clicked "Save" in the modal
- Changes are saved to localStorage automatically

## Notes

- **Edit mode is only for IT Lead** (Joseph) — other users can only view and comment
- **Changes are saved locally** in your browser's localStorage
- **Use "Export JSON"** button to backup your changes
- **Use "Reset"** button to restore default data (careful!)
