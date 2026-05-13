# IT Standard Operating Procedures & Quality Objectives
## Practical Best Practices for Reliable IT Operations

**Document Version:** 1.0  
**Effective Date:** May 2026  
**Scope:** Information Technology Department  
**Applicable To:** All IT staff, system users, and departments using IT services

**Note:** This document outlines proven best practices that work. We're not implementing formal ISO certification — we're adopting what we know keeps systems running smoothly and protects the business.

---

## 1. QUALITY POLICY

Hyperfeeds commits to delivering reliable, secure, and user-centric IT services that support business objectives. We do this through clear processes, documented procedures, and continuous improvement.

**Quality Objectives:**
- Achieve 99.5% system uptime (excluding planned maintenance)
- Resolve critical incidents within 4 hours
- Complete change requests within agreed SLAs
- Maintain 100% data security compliance
- Achieve 95% user satisfaction on IT services

---

## 2. IT SERVICE MANAGEMENT SOPs

### 2.1 Incident Management SOP

**What it is:** When something breaks (server down, system slow, data issue), we have a clear process to fix it fast.

**What we do:**
1. User reports the problem
2. IT logs it and marks how urgent (Critical/High/Medium/Low)
3. Assign to the right person immediately
4. Fix the problem
5. Tell everyone it's fixed
6. Write down what happened and how we fixed it

**Response Times:**
- Critical (system down): Someone working on it within 4 hours
- High (major slowdown): Within 8 hours
- Medium (minor issue): Within 24 hours
- Low (cosmetic): Within 48 hours

**Who handles it:** IT Help Desk Lead + Technical Team

---

### 2.2 Change Management SOP

**What it is:** Before we update software, install patches, or change system settings, we plan it, test it, and tell people what's happening.

**What we do:**
1. Someone requests a change (e.g., "Update Power BI to latest version")
2. IT checks: Will this break anything? Do we have time? What's the risk?
3. Get approval from IT Manager
4. Schedule it for a time that won't disrupt work (usually after hours)
5. Tell all users 2 days before it happens
6. Make the change with a backup plan in case something goes wrong
7. Test it works
8. Write down what we changed
9. Check it's still working 5 days later

**Types of Changes:**
- **Routine** (patches, updates): Approved in 1-2 days
- **Normal** (new features): Approved in 3-5 days
- **Emergency** (critical fix): Approved immediately, reviewed after

**Who handles it:** IT Manager

---

### 2.3 Problem Management SOP

**What it is:** If the same problem keeps happening (e.g., server crashes 3 times a month), we find the root cause and fix it permanently instead of just patching it each time.

**What we do:**
1. Notice the pattern (same issue happening repeatedly)
2. Log it as a "problem" not just an incident
3. Dig deep to find the real cause (not just the symptom)
4. Design a permanent fix
5. Test it thoroughly
6. Roll it out using our change process
7. Watch it for 2 months to make sure it's really fixed
8. Write down the solution so we remember it next time

**Who handles it:** IT Manager + Technical Team

---

### 2.4 Asset Management SOP

**What it is:** We keep track of all computers, software licenses, and subscriptions so we know what we have, when licenses expire, and when equipment needs replacing.

**What we do:**
1. Approve purchase with IT Manager
2. Check it arrives in good condition
3. Log it in our inventory (with serial number)
4. Assign it to a user
5. Schedule maintenance (e.g., server checks, laptop updates)
6. Watch for license expiry dates and warranty dates
7. Check inventory every 3 months
8. When equipment is old, safely delete the data and retire it
9. Keep records updated

**What we track:**
- Computers, servers, network equipment
- Software licenses and subscriptions
- Cloud services (Microsoft 365, Supabase, etc.)

**Who handles it:** IT Manager

---

### 2.5 Backup & Disaster Recovery SOP

**What it is:** We back up all important data regularly so if something goes wrong (hardware failure, ransomware, accidental deletion), we can restore it.

**What we do:**
1. Identify which systems are critical (Power BI, HMS, Sage, email)
2. Set up automatic daily backups
3. Keep copies in different locations (on-site + cloud)
4. Check every day that backups completed successfully
5. Test recovery every 3 months (practice restoring data)
6. Write down how to recover if disaster happens
7. Review strategy annually

**Backup Schedule:**
- Daily backups (kept for 30 days)
- Weekly full backups (kept for 90 days)
- Monthly archives (kept for 1 year)
- Off-site copies for critical systems

**Recovery Targets:**
- Critical systems: Back online within 4 hours, lose max 1 hour of data
- Important systems: Back online within 24 hours, lose max 4 hours of data
- Standard systems: Back online within 1 week, lose max 1 day of data

**Who handles it:** IT Manager

---

### 2.6 Security & Access Control SOP

**What it is:** We control who can access what systems and data, use strong passwords, and keep everything encrypted so hackers can't get in.

**User Access:**
1. Manager requests access for new employee (e.g., "John needs Power BI access")
2. IT Manager approves it
3. Create account and set permissions (e.g., can view reports but not edit)
4. Give credentials and training
5. Review access every 3 months (do they still need it?)
6. Remove access immediately when someone leaves
7. Log all changes

**Passwords & Login:**
- Strong passwords required (12+ characters, mix of letters/numbers/symbols)
- Two-factor authentication for sensitive systems (e.g., email, Sage)
- Change passwords every 90 days
- No shared passwords

**Data Protection:**
- Encrypt sensitive data (financial info, customer data)
- Only give people access to what they need for their job
- Check access logs monthly
- Label data: Public (anyone), Internal (staff only), Confidential (managers only), Restricted (finance only)

**Who handles it:** IT Manager

---

### 2.7 System Maintenance SOP

**What it is:** Like servicing a car, we regularly maintain servers, databases, and systems to keep them running fast and secure.

**What we do:**
1. Plan maintenance for off-hours (nights/weekends)
2. Tell users a week before
3. Back up everything first
4. Apply security patches and updates
5. Test everything still works
6. Watch for problems for 24 hours
7. Write down what we did
8. Review if anything went wrong

**Maintenance Schedule:**
- Security patches: Monthly
- Database cleanup: Every 3 months
- Server health checks: Every 3 months
- Software license checks: Once a year

**Who handles it:** IT Manager

---

## 3. QUALITY OBJECTIVES & METRICS

### 3.1 Availability & Performance

| Objective | Target | Measurement | Frequency |
|-----------|--------|-------------|-----------|
| System Uptime | 99.5% | Monitor uptime % | Daily |
| Response Time | < 2 sec | Application performance | Weekly |
| Backup Success | 100% | Backup logs | Daily |
| Patch Compliance | 100% | Security audit | Monthly |

### 3.2 Service Delivery

| Objective | Target | Measurement | Frequency |
|-----------|--------|-------------|-----------|
| Incident Resolution (Critical) | 8 hours | Ticket SLA | Per incident |
| Incident Resolution (High) | 24 hours | Ticket SLA | Per incident |
| Change Approval Time | 3-5 days | Change log | Per change |
| User Satisfaction | 95% | Survey | Quarterly |

### 3.3 Security & Compliance

| Objective | Target | Measurement | Frequency |
|-----------|--------|-------------|-----------|
| Access Control Audit | 100% | User access review | Quarterly |
| Security Incidents | 0 breaches | Incident log | Monthly |
| Compliance Audit | Pass | Internal audit | Annually |
| Password Compliance | 100% | User audit | Quarterly |

### 3.4 Documentation & Training

| Objective | Target | Measurement | Frequency |
|-----------|--------|-------------|-----------|
| SOP Currency | 100% | Document review | Annually |
| Staff Training | 100% | Training records | Annually |
| Knowledge Base | 95% complete | KB audit | Quarterly |
| Runbook Updates | 100% | Update log | Per change |

---

## 4. DEPARTMENTAL EXTENSION (Can Be Used by Other Departments)

These same practices work for other departments. Here are examples:

### 4.1 Finance Department
- **What they do:** Process invoices, approve expenses, reconcile accounts, keep records
- **Goals:** No payment errors, pay suppliers on time, pass audits
- **How to measure:** Time to process, error rate, audit results

### 4.2 Operations / Manufacturing
- **What they do:** Schedule production, check quality, maintain equipment, keep people safe
- **Goals:** High quality products, no accidents, deliver on time
- **How to measure:** Product defects, safety incidents, on-time delivery

### 4.3 Sales / Customer Service
- **What they do:** Process orders, support customers, handle complaints, follow up
- **Goals:** Fast response, happy customers, no unresolved issues
- **How to measure:** Response time, customer satisfaction, complaint resolution

### 4.4 HR / Administration
- **What they do:** Hire people, onboard them, pay them, manage leave, review performance
- **Goals:** Accurate payroll, no compliance issues, keep good people
- **How to measure:** Processing time, compliance checks, staff retention

---

## 5. DOCUMENT CONTROL

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | May 2026 | Joseph (IT Lead) | Initial QMS framework |

**Review Schedule:** Annually or upon significant process change  
**Approval:** MD + IT Manager  
**Distribution:** All IT staff + Department Heads

---

## 6. CONTINUOUS IMPROVEMENT

### 6.1 Quarterly Reviews
Every 3 months, IT Manager meets with Department Heads to discuss:
- How are systems performing? (uptime, speed, issues)
- What problems keep happening?
- What can we do better?
- Do we need more resources?
- Update processes based on what we learn

### 6.2 Fix Recurring Problems
When the same issue happens multiple times:
1. Document what's happening
2. Find the root cause (not just the symptom)
3. Implement a permanent fix
4. Check it works for 2 months
5. Close it out

---

## 7. ROLES & RESPONSIBILITIES

| Role | Responsibility |
|------|-----------------|
| **MD** | Approve QMS policy, allocate resources, strategic oversight |
| **IT Manager** | Implement SOPs, manage team, monitor metrics, report to MD |
| **IT Staff** | Follow SOPs, document work, report issues, suggest improvements |
| **Department Heads** | Comply with IT policies, report incidents, participate in reviews |
| **Quality Lead** | Audit compliance, manage documentation, drive improvements |

---

## 8. APPENDICES

### A. Incident Severity Levels
- **Critical:** System down, data loss, security breach → 4-hour response
- **High:** Major functionality impaired → 8-hour response
- **Medium:** Minor functionality impaired → 24-hour response
- **Low:** Cosmetic issue, workaround available → 48-hour response

### B. Change Request Template
```
Title: [Brief description]
Requester: [Name]
Business Justification: [Why needed]
Impact: [Systems/users affected]
Risk Level: [Low/Medium/High]
Rollback Plan: [How to undo if needed]
Implementation Date: [Proposed window]
Testing Plan: [How to verify]
```

### C. Incident Report Template
```
Incident ID: [Auto-generated]
Title: [Brief description]
Severity: [Critical/High/Medium/Low]
Reported By: [Name]
Time Reported: [Date/Time]
Systems Affected: [List]
Impact: [# users, business impact]
Root Cause: [Analysis]
Resolution: [What was done]
Time Resolved: [Date/Time]
Lessons Learned: [Improvements]
```

---

**Document Control:** This document is controlled. Unauthorized changes are prohibited.  
**Next Review Date:** May 2027
