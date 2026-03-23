import { FormData, Question } from '@/types/form';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  data: Partial<FormData>;
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'contact',
    name: 'THE NERVE CENTER',
    description: 'HIGH-CONTRAST INDUSTRIAL CONTACT FORM. MINIMAL, BRUTAL, EFFECTIVE.',
    icon: 'Mail',
    data: {
      title: 'INQUIRY_ARCHIVE_01',
      description: 'SECURE CHANNEL FOR EXTERNAL COMMUNICATIONS.',
      theme: 'brutalist_dark',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'grid',
        borderRadius: 0,
        cardOpacity: 100,
        shadowDepth: 8,
        borderWidth: 4
      },
      questions: [
        { id: 'q1', type: 'short_text', title: 'IDENTIFICATION / NAME', required: true },
        { id: 'q2', type: 'email', title: 'SECURE_EMAIL_ADDRESS', required: true },
        { id: 'q3', type: 'short_text', title: 'SUBJECT_OF_INTEREST', required: false },
        { id: 'q4', type: 'long_text', title: 'DETAILED_MESSAGE_LOG', required: true },
      ]
    }
  },
  {
    id: 'registration',
    name: 'CORE_IDENTITY_REG',
    description: 'A RIGID REGISTRATION PROTOCOL FOR NEW OPERATIVES.',
    icon: 'UserPlus',
    data: {
      title: 'REGISTRATION_MODULE_v2',
      description: 'ESTABLISH YOUR DIGITAL FOOTPRINT IN THE REVOX ECOSYSTEM.',
      theme: 'monochrome',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'none',
        borderRadius: 0,
        cardOpacity: 100,
        shadowDepth: 4,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'short_text', title: 'FULL_LEGAL_NAME', required: true },
        { id: 'q2', type: 'email', title: 'PRIMARY_EMAIL_PROTOCOL', required: true },
        { id: 'q3', type: 'phone', title: 'CONTACT_SIGNAL_STRENGTH (PHONE)', required: false },
        { id: 'q4', type: 'date', title: 'BIRTH_TIMESTAMP', required: true },
        { id: 'q5', type: 'yes_no', title: 'ACCEPT_TERMS_OF_SERVICE', required: true },
      ]
    }
  },
  {
    id: 'login',
    name: 'TERMINAL_ACCESS',
    description: 'MINIMALIST ACCESS PORTAL FOR SECURE LOGIN FLOWS.',
    icon: 'LogIn',
    data: {
      title: 'ACCESS_AUTH_PROTOCOL',
      description: 'ENTER CREDENTIALS TO INITIALIZE SESSION.',
      theme: 'warm_terminal',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'large',
        bgPattern: 'none',
        borderRadius: 4,
        cardOpacity: 100,
        shadowDepth: 0,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'short_text', title: 'SECURE_USERNAME', required: true },
        { id: 'q2', type: 'short_text', title: 'ACCESS_KEY (PASSWORD)', required: true },
      ]
    }
  },
  {
    id: 'signup',
    name: 'VANGUARD_ONBOARDING',
    description: 'HIGH-GLOW SIGNUP PAGE FOR MODERN WEB APPLICATIONS.',
    icon: 'UserPlus',
    data: {
      title: 'INITIALIZE_IDENTITY',
      description: 'JOIN THE RANKS OF THE ELITE.',
      theme: 'neon_industrial',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'grid',
        borderRadius: 8,
        cardOpacity: 80,
        shadowDepth: 0,
        borderWidth: 3
      },
      questions: [
        { id: 'q1', type: 'short_text', title: 'CHOSEN_CALLSIGN', required: true },
        { id: 'q2', type: 'email', title: 'COMMUNICATION_RELAY', required: true },
        { id: 'q3', type: 'short_text', title: 'ACCESS_CODE', required: true },
        { id: 'q4', type: 'short_text', title: 'CONFIRM_CODE', required: true },
      ]
    }
  },
  {
    id: 'rsvp',
    name: 'DEPLOYMENT_RSVP',
    description: 'BOLD NEON RSVP FORM FOR HIGH-PROFILE OPERATIONS AND EVENTS.',
    icon: 'Calendar',
    data: {
      title: 'RSVP_DEPLOYMENT_PLAN',
      description: 'CONFIRM ATTENDANCE FOR THE NEXT OPERATION.',
      theme: 'cyber_toxic',
      layout: 'notebook',
      style: {
        fontFamily: 'mono',
        fontSize: 'large',
        bgPattern: 'grid',
        borderRadius: 0,
        cardOpacity: 90,
        shadowDepth: 12,
        borderWidth: 6
      },
      questions: [
        { id: 'sec1', type: 'section_header', title: 'DEPLOYMENT_STATUS', required: false } as Question,
        { 
          id: 'q1', 
          type: 'logic_mcq', 
          title: 'WILL_YOU_DEPLOY?', 
          required: true,
          options: [
            { id: 'opt1', label: 'YES_CONFIRMED', navigateToSectionId: 'sec2' },
            { id: 'opt2', label: 'NEGATIVE_ABORT', navigateToSectionId: 'sec3' }
          ]
        },
        { id: 'sec2', type: 'section_header', title: 'LOGISTICS_LOADOUT', required: false } as Question,
        { id: 'number', type: 'number', title: 'SQUAD_SIZE (GUESTS)', required: true },
        { id: 'diet', type: 'long_text', title: 'RATION_RESTRICTIONS (DIETARY)', required: false },
        { id: 'sec3', type: 'section_header', title: 'ABORT_REPORT', required: false } as Question,
        { id: 'reason', type: 'long_text', title: 'REASON_FOR_NON_DEPLOYMENT', required: false },
      ]
    }
  },
  {
    id: 'feedback',
    name: 'SIGNAL & NOISE',
    description: 'A CLEAN, ANALYTICAL FEEDBACK SURVEY TO DECODE USER SENTIMENT.',
    icon: 'Activity',
    data: {
      title: 'OPERATIONAL_FEEDBACK_LOG',
      description: 'COLLECTING DATA TO OPTIMIZE PERFORMANCE.',
      theme: 'clean_light',
      layout: 'notebook',
      style: {
        fontFamily: 'sans',
        fontSize: 'medium',
        bgPattern: 'dots',
        borderRadius: 16,
        cardOpacity: 95,
        shadowDepth: 2,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'rating', title: 'OVERALL_SATISFACTION_INDEX', required: true, maxRating: 5 },
        { id: 'q2', type: 'long_text', title: 'WHAT_WAS_THE_PRIMARY_VALUE?', required: false },
        { id: 'q3', type: 'long_text', title: 'IDENTIFIED_FRICTION_POINTS', required: false },
        { id: 'q4', type: 'linear_scale', title: 'REC_INDEX (NPS)', required: false, minScale: 1, maxScale: 10, minLabel: 'UNLIKELY', maxLabel: 'SURE' },
      ]
    }
  },
  {
    id: 'survey',
    name: 'MARKET_DECODER',
    description: 'DEEP DIVE SURVEY FOR MARKET RESEARCH AND DATA COLLECTION.',
    icon: 'Search',
    data: {
      title: 'MARKET_ANALYSIS_MOD_4',
      description: 'CONTRIBUTE TO THE AGGREGATE KNOWLEDGE BASE.',
      theme: 'deep_ocean',
      layout: 'notebook',
      style: {
        fontFamily: 'sans',
        fontSize: 'medium',
        bgPattern: 'grid',
        borderRadius: 20,
        cardOpacity: 85,
        shadowDepth: 6,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'single_choice', title: 'AGE_DEMOGRAPHIC', required: true, options: [
          { id: 'a1', label: '18-24' },
          { id: 'a2', label: '25-34' },
          { id: 'a3', label: '35-44' },
          { id: 'a4', label: '45+' },
        ]},
        { id: 'q2', type: 'multiple_choice', title: 'INTEREST_SECTORS', required: true, options: [
          { id: 'i1', label: 'TECH' },
          { id: 'i2', label: 'FINANCE' },
          { id: 'i3', label: 'DESIGN' },
          { id: 'i4', label: 'ART' },
        ]},
        { id: 'q3', type: 'dropdown', title: 'PRIMARY_GEOGRAPHY', required: true, options: [
          { id: 'g1', label: 'NORTH_AMERICA' },
          { id: 'g2', label: 'EUROPE' },
          { id: 'g3', label: 'ASIA' },
          { id: 'g4', label: 'OTHER' },
        ]},
      ]
    }
  },
  {
    id: 'job',
    name: 'RECRUIT_TERMINAL',
    description: 'PROFESSIONAL JOB APPLICATION FORM FOR ELITE TEAMS.',
    icon: 'Briefcase',
    data: {
      title: 'TALENT_ACQUISITION_09',
      description: 'STATE YOUR QUALIFICATIONS FOR THE ASSIGNMENT.',
      theme: 'monochrome',
      layout: 'single_page',
      style: {
        fontFamily: 'serif',
        fontSize: 'medium',
        bgPattern: 'none',
        borderRadius: 2,
        cardOpacity: 100,
        shadowDepth: 0,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'short_text', title: 'LEGAL_NAME', required: true },
        { id: 'q2', type: 'email', title: 'CONTACT_EMAIL', required: true },
        { id: 'q3', type: 'short_text', title: 'PORTFOLIO_LINK / LINKEDIN', required: true },
        { id: 'q4', type: 'dropdown', title: 'DESIRED_POSITION', required: true, options: [
          { id: 'p1', label: 'FRONTEND_ENGINEER' },
          { id: 'p2', label: 'BACKEND_ENGINEER' },
          { id: 'p3', label: 'PRODUCT_DESIGNER' },
          { id: 'p4', label: 'REVOX_OPERATIVE' },
        ]},
        { id: 'q5', type: 'long_text', title: 'WHY_REVOX?', required: true },
        { id: 'q6', type: 'file_upload', title: 'CURRICULUM_VITAE (PDF Only)', required: true },
      ]
    }
  },
  {
    id: 'order',
    name: 'COMMERCE_PROTOCOL',
    description: 'SLEEK ORDER FORM FOR PRODUCTS AND SERVICES.',
    icon: 'ShoppingCart',
    data: {
      title: 'COMMERCE_CHECKOUT_SYS',
      description: 'FINALIZE YOUR SELECTION AND INITIALIZE PROCUREMENT.',
      theme: 'royal_gold',
      layout: 'single_page',
      style: {
        fontFamily: 'serif',
        fontSize: 'medium',
        bgPattern: 'none',
        borderRadius: 0,
        cardOpacity: 90,
        shadowDepth: 10,
        borderWidth: 3
      },
      questions: [
        { id: 'q1', type: 'multiple_choice', title: 'PRODUCT_SELECT', required: true, options: [
          { id: 'o1', label: 'REVOX_PRIME_ACCESS' },
          { id: 'o2', label: 'NEON_THEME_PACK' },
          { id: 'o3', label: 'ANALYTICS_ADDON' },
        ]},
        { id: 'q2', type: 'number', title: 'QUANTITY', required: true },
        { id: 'q3', type: 'long_text', title: 'SHIPPING_COORDINATES', required: true },
        { id: 'q4', type: 'dropdown', title: 'SHIPPING_SPEED', required: true, options: [
          { id: 's1', label: 'STANDARD_DELAY' },
          { id: 's2', label: 'EXPRESS_OVERTAKE' },
        ]},
      ]
    }
  },
  {
    id: 'booking',
    name: 'TEMPORAL_RSVP',
    description: 'APPOINTMENT BOOKING FORM WITH PRECISE TIME LOGS.',
    icon: 'Clock',
    data: {
      title: 'TEMPORAL_SLOT_RESERVATION',
      description: 'CLAIM YOUR WINDOW OF OPPORTUNITY.',
      theme: 'retro_paper',
      layout: 'single_page',
      style: {
        fontFamily: 'serif',
        fontSize: 'medium',
        bgPattern: 'none',
        borderRadius: 4,
        cardOpacity: 100,
        shadowDepth: 4,
        borderWidth: 1
      },
      questions: [
        { id: 'q1', type: 'date', title: 'REQUESTED_DATE', required: true },
        { id: 'q2', type: 'time', title: 'REQUESTED_START_TIME', required: true },
        { id: 'q3', type: 'dropdown', title: 'SESSION_TYPE', required: true, options: [
          { id: 't1', label: 'STRATEGY_BRIEFING' },
          { id: 't2', label: 'TECHNICAL_AUDIT' },
          { id: 't3', label: 'DEBRIEF' },
        ]},
        { id: 'q4', type: 'long_text', title: 'ADDITIONAL_CONTEXT', required: false },
      ]
    }
  },
  {
    id: 'newsletter',
    name: 'SIGNAL_SUBSCRIBE',
    description: 'MINIMAL NEWSLETTER SIGNUP FOR CONSISTENT UPDATES.',
    icon: 'Mail',
    data: {
      title: 'SIGNAL_NEWSLETTER_SUB',
      description: 'JOIN THE FREQUENCY. NEVER MISS A BROADCAST.',
      theme: 'brutalist_dark',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'grid',
        borderRadius: 0,
        cardOpacity: 100,
        shadowDepth: 10,
        borderWidth: 5
      },
      questions: [
        { id: 'q1', type: 'email', title: 'RELAY_STATION (EMAIL)', required: true },
        { id: 'q2', type: 'yes_no', title: 'WEEKLY_DIGEST_PROTOCOL', required: true },
      ]
    }
  },
  {
    id: 'support',
    name: 'SOS_PROTOCOL',
    description: 'SUPPORT TICKET FORM FOR URGENT TECHNICAL ASSISTANCE.',
    icon: 'HelpCircle',
    data: {
      title: 'INCIDENT_REPORT_SYS',
      description: 'LOG AN ANOMALY IN THE SYSTEM.',
      theme: 'midnight_vampire',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'grid',
        borderRadius: 0,
        cardOpacity: 100,
        shadowDepth: 10,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'dropdown', title: 'INCIDENT_SEVERITY', required: true, options: [
          { id: 's1', label: 'LOW_PRIORITY' },
          { id: 's2', label: 'SYSTEM_ERROR' },
          { id: 's3', label: 'CRITICAL_FAILURE' },
        ]},
        { id: 'q2', type: 'short_text', title: 'ERROR_CODE/TITLE', required: true },
        { id: 'q3', type: 'long_text', title: 'REPRODUCTION_STEPS', required: true },
        { id: 'q4', type: 'file_upload', title: 'SCREENSHOT_EVIDENCE', required: false },
      ]
    }
  },
  {
    id: 'payment',
    name: 'FINANCE_RELAY',
    description: 'SECURE PAYMENT FORM FOR TRANSACTION INITIALIZATION.',
    icon: 'CreditCard',
    data: {
      title: 'SECURE_TRANS_AUTHORITY',
      description: 'INITIALIZE SECURE PROCUREMENT PROTOCOL.',
      theme: 'warm_terminal',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'none',
        borderRadius: 4,
        cardOpacity: 100,
        shadowDepth: 8,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'number', title: 'TRANSFER_AMOUNT (USD)', required: true },
        { id: 'q2', type: 'short_text', title: 'CARDHOLDER_NAME', required: true },
        { id: 'q3', type: 'short_text', title: 'TRANSACTION_ID (MOCK)', required: true },
        { id: 'q4', type: 'yes_no', title: 'AUTHORIZE_TRANSFER', required: true },
      ]
    }
  },
  {
    id: 'leave',
    name: 'AWOL_REQUEST',
    description: 'LEAVE APPLICATION FORM FOR SCHEDULED DOWNTIME.',
    icon: 'LogOut',
    data: {
      title: 'LEAVE_ABSENCE_MOD',
      description: 'REQUEST OFFICIAL DOWNTIME FROM OPERATIONS.',
      theme: 'retro_paper',
      layout: 'notebook',
      style: {
        fontFamily: 'serif',
        fontSize: 'medium',
        bgPattern: 'none',
        borderRadius: 0,
        cardOpacity: 100,
        shadowDepth: 4,
        borderWidth: 2
      },
      questions: [
        { id: 'q1', type: 'dropdown', title: 'LEAVE_TYPE', required: true, options: [
          { id: 't1', label: 'VACATION_PROTOCOL' },
          { id: 't2', label: 'INTERNAL_FAILURE (SICK)' },
          { id: 't3', label: 'PERSONAL_AFFAIRS' },
        ]},
        { id: 'q2', type: 'date', title: 'START_TIMESTAMP', required: true },
        { id: 'q3', type: 'date', title: 'END_TIMESTAMP', required: true },
        { id: 'q4', type: 'long_text', title: 'DELEGATION_NOTES', required: true },
      ]
    }
  },
  {
    id: 'complaint',
    name: 'GRIEVANCE_ARCHIVE',
    description: 'OFFICIAL COMPLAINT FORM FOR LOGGING DISCREPANCIES.',
    icon: 'MessageSquare',
    data: {
      title: 'COMPLAINT_LOG_99',
      description: 'FORMAL RECORD OF SYSTEMIC DISCREPANCIES.',
      theme: 'cyber_toxic',
      layout: 'single_page',
      style: {
        fontFamily: 'mono',
        fontSize: 'medium',
        bgPattern: 'grid',
        borderRadius: 0,
        cardOpacity: 100,
        shadowDepth: 12,
        borderWidth: 4
      },
      questions: [
        { id: 'q1', type: 'short_text', title: 'GRIEVANCE_ID', required: true },
        { id: 'q2', type: 'date', title: 'INCIDENT_DATE', required: true },
        { id: 'q3', type: 'long_text', title: 'DESCRIPTION_OF_FAULT', required: true },
        { id: 'q4', type: 'short_text', title: 'WITNESS_CALLSIGNS', required: false },
        { id: 'q5', type: 'yes_no', title: 'WANT_OFFICIAL_FOLLOW_UP?', required: true },
      ]
    }
  }
];
