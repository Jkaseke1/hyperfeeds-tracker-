# Manual Password Reset Guide (For IT Lead)

## Problem
The automatic password reset email feature requires Supabase email templates to be configured. Until that's set up, you can manually reset passwords using the Supabase dashboard.

## Option 1: Reset Password via Supabase Dashboard (Recommended)

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select your **hyperfeeds-tracker** project
3. Go to **Authentication** → **Users** (left sidebar)

### Step 2: Find the User
1. Search for the user by email
2. Click on the user row

### Step 3: Reset Password
1. Click **"Send password recovery"** button
   - OR -
2. Click **"Reset password"** and manually set a new password

### Step 4: Notify the User
Send them their new temporary password and ask them to change it after signing in.

---

## Option 2: Direct SQL Password Update (Advanced)

If email isn't working, you can set a password directly via SQL:

### Step 1: Go to SQL Editor
1. Supabase Dashboard → **SQL Editor** → **New query**

### Step 2: Run This Query
```sql
-- Replace with actual email and new password
UPDATE auth.users
SET encrypted_password = crypt('NEW_PASSWORD_HERE', gen_salt('bf'))
WHERE email = 'user@hyperfeeds.co.zw';
```

### Step 3: Notify User
Tell them their new password.

---

## Option 3: Configure Email Templates (One-Time Setup)

To enable automatic password reset emails:

### Step 1: Go to Email Templates
1. Supabase Dashboard → **Authentication** → **Email Templates**

### Step 2: Configure "Reset Password" Template
1. Click **"Reset Password"** template
2. Ensure the template is enabled
3. Check the **"Confirm your mail"** link works
4. Save changes

### Step 3: Test
1. Try the "Forgot password?" feature again
2. Check spam folder if email doesn't arrive

---

## Quick Reference: Common Password Reset Scenarios

### Scenario 1: User Forgot Password
**Solution:** Use Option 1 (Dashboard reset)

### Scenario 2: User Never Received Signup Email
**Solution:** 
1. Check if user exists in Authentication → Users
2. If yes, use Option 1 to send recovery email
3. If no, they need to sign up again

### Scenario 3: Email Not Working at All
**Solution:** Use Option 2 (SQL password update)

### Scenario 4: You (Joseph) Forgot Your Password
**Solution:**
1. Use Option 2 with your email
2. Or create a new account and set it as 'lead':
   ```sql
   update public.profiles 
   set role = 'lead' 
   where email = 'new-email@hyperfeeds.co.zw';
   ```

---

## Security Notes

- ✅ Always use strong passwords (min 8 characters, mix of letters/numbers/symbols)
- ✅ Don't share passwords via insecure channels (use in-person or encrypted messaging)
- ✅ Ask users to change temporary passwords immediately after first login
- ✅ Keep a record of who has 'lead' role access

---

## Troubleshooting

### "Failed to fetch" Error
**Cause:** Supabase email service not configured or network issue

**Fix:** Use Option 1 or 2 above

### User Can't Sign In After Reset
**Cause:** Password not updated correctly

**Fix:** 
1. Check user exists in Authentication → Users
2. Try Option 2 (SQL update) with a simple password
3. Test sign-in

### Multiple Users Need Reset
**Cause:** Bulk password reset needed

**Fix:**
1. Go to Authentication → Users
2. Select multiple users (checkbox)
3. Click "Send password recovery" for all

---

## Contact

If you need help with password resets, contact:
- **Joseph Kaseke** (IT Lead)
- Email: it02@hyperfeeds.co.zw
