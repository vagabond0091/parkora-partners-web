# Parkora Partners Web

Parkora Partners Web is the partner-facing web application for the Parkora platform. It provides parking business partners with a streamlined digital experience to register their business, submit verification documents, and manage their partnership — all from a single, intuitive dashboard.

Whether you're a parking lot operator, a valet service provider, or any other parking-related business looking to partner with Parkora, this application guides you through the entire onboarding process and gives you full visibility into your partnership status.

## What Can You Do?

### Register Your Business

Create a partner account by providing your company information, contact details, and business address. The registration process captures everything needed to get your partnership started:

- Company name, business registration number, and tax ID
- Contact email and phone number with international support
- Business address with country and region selection
- Secure account credentials

### Log In and Manage Your Account

After registration, securely log in to access your personalized dashboard. Your session stays active so you can pick up where you left off. If you forget your password, the recovery flow helps you regain access quickly.

### Submit Verification Documents

Upload the documents required to verify your business. The platform supports multiple document types:

- **Business License** — Your official business operating license
- **Tax Identification** — Tax registration or EIN certificate
- **Business Registration** — Company registration certificate
- **Identity Document** — Personal ID for authorized representatives
- **Address Proof** — Documents confirming your business address
- **Additional Documents** — Any supplementary documents as required

You can upload documents individually or in bulk, and view or replace them at any time.

### Track Your Verification Status

Monitor the progress of your document verification in real time. Each document goes through a clear lifecycle:

1. **Pending** — Document uploaded, waiting for review
2. **Under Review** — A verification team member is currently reviewing your document
3. **Verified** — Document has been approved
4. **Rejected** — Document was not approved (with a reason provided so you can resubmit)

### Partner Dashboard

Your main hub after logging in. The dashboard gives you a snapshot of your partnership at a glance — submitted documents, verification progress, and any actions you need to take.

### Analytics

View insights and metrics related to your partnership performance. Track trends and understand how your business is performing within the Parkora platform.

### Settings

Manage your account preferences and profile information from the settings page.

## Admin Features

Administrators have access to additional tools for managing the platform:

- **Admin Dashboard** — Overview of all partner activity across the platform
- **Verification Management** — Review, approve, or reject partner documents with detailed side-panel views
- **Partner List** — Browse and manage all registered partners
- **Pending Verifications** — Focused view of partners awaiting document review

## Document Verification Process

The verification process ensures that all partners meet Parkora's requirements:

1. **Partner submits documents** — Upload required files through the dashboard
2. **Documents enter review queue** — Status changes to "Pending"
3. **Admin reviews documents** — An administrator examines each document for validity
4. **Decision is made** — Documents are either verified or rejected with feedback
5. **Partner is notified** — Status updates are visible immediately on the dashboard

If a document is rejected, you'll see the reason and can upload a corrected version.

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd parkora-partners-web
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at **http://localhost:5173**.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run code quality checks |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## Security and Privacy

- All communications between the app and API are secured
- Authentication is token-based with automatic session management
- Routes are protected — unauthenticated users are redirected to the login page
- Role-based access ensures partners and admins only see what they're authorized to

## Need Help?

- Use the interactive API documentation (Swagger UI) available at `/swagger-ui.html` on the backend for detailed endpoint information
- Review error messages carefully — they provide helpful guidance on what went wrong
- Contact your Parkora representative for additional support

## Important Notes

- Keep your login credentials secure and never share them with others
- Ensure uploaded documents are clear, legible, and in supported formats (PDF, images, etc.)
- If a document is rejected, read the rejection reason carefully and upload a corrected version
- Your account access level depends on your assigned role (Partner or Admin)

---

**Welcome to Parkora!** We're here to help make managing your parking business partnership as smooth as possible.
