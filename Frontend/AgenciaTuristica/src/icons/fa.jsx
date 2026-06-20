const createIcon = (path) => {
  function Icon({ className = "", ...props }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {path}
      </svg>
    );
  }

  return Icon;
};

const circle = <path d="M12 2a10 10 0 1 0 .01 0H12Z" />;
const user = <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />;

export const FaBars = createIcon(<path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />);
export const FaTimes = createIcon(<path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Zm11.2 0L19 6.4 6.4 19 5 17.6 17.6 5Z" />);
export const FaChevronDown = createIcon(<path d="m7 9 5 5 5-5 1.4 1.4L12 16.8l-6.4-6.4L7 9Z" />);
export const FaUser = createIcon(user);
export const FaUserCircle = createIcon(
  <>
    {circle}
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 2c-3.2 0-5.8 1.6-6.8 4a8 8 0 0 0 13.6 0c-1-2.4-3.6-4-6.8-4Z" fill="#fff" />
  </>,
);
export const FaCalendarAlt = createIcon(<path d="M7 2h2v3h6V2h2v3h3v16H4V5h3V2Zm11 8H6v9h12v-9Z" />);
export const FaSignOutAlt = createIcon(<path d="M4 3h9v2H6v14h7v2H4V3Zm12.6 5.6L20 12l-3.4 3.4-1.4-1.4 1-1H10v-2h6.2l-1-1 1.4-1.4Z" />);
export const FaUsers = createIcon(<path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 14c-3.3 0-6 1.8-6 4v2h12v-2c0-2.2-2.7-4-6-4Zm8 0c-.7 0-1.4.1-2 .3 1.2.9 2 2.2 2 3.7v2h6v-2c0-2.2-2.7-4-6-4Z" />);
export const FaBoxOpen = createIcon(<path d="m12 3 9 4-3 4-6-2.7L6 11 3 7l9-4Zm-7 9 7 3 7-3v6l-7 3-7-3v-6Z" />);
export const FaTachometerAlt = createIcon(<path d="M12 4a10 10 0 0 0-8.7 15h17.4A10 10 0 0 0 12 4Zm1 9.4V7h-2v6.4a2 2 0 1 0 2 0Z" />);
export const FaFacebookF = createIcon(<path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z" />);
export const FaInstagram = createIcon(<path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />);
export const FaWhatsapp = createIcon(<path d="M12 3a8.5 8.5 0 0 0-7.3 13L4 21l5.1-1.3A8.5 8.5 0 1 0 12 3Zm4.8 12.1c-.2.7-1.2 1.2-1.8 1.3-.5.1-1.2.1-3.6-.9-3-1.2-5-4.2-5.1-4.4-.2-.2-1.2-1.6-1.2-3s.8-2.1 1.1-2.4c.2-.2.5-.3.8-.3h.6c.2 0 .4.1.5.4l.8 2c.1.3.1.5-.1.7l-.5.6c-.2.2-.2.4 0 .7.2.4.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.5 1.5.3.1.5.1.7-.1l.8-1c.2-.3.5-.3.8-.2l2 .9c.3.2.5.3.5.5 0 .1 0 .8-.2 1.6Z" />);
export const FaMapMarkerAlt = createIcon(<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />);
export const FaPhoneAlt = createIcon(<path d="M6.6 2 10 5.4 7.8 8c.8 1.7 2.5 3.4 4.2 4.2l2.6-2.2 3.4 3.4-1.6 4.2c-.4.9-1.4 1.5-2.4 1.3C8.9 17.8 4.2 13.1 3.1 8c-.2-1 .4-2 1.3-2.4L6.6 2Z" />);
export const FaEnvelope = createIcon(<path d="M3 5h18v14H3V5Zm9 8 7-6H5l7 6Zm-2 1.5L5 10v7h14v-7l-5 4.5c-1.1 1-2.9 1-4 0Z" />);
export const FaCheckCircle = createIcon(<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5-5 1.4 1.4-6.4 6.4Z" />);
export const FaTimesCircle = createIcon(<path d="M12 2a10 10 0 1 0 .01 0H12Zm3.5 12.1-1.4 1.4-2.1-2.1-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1Z" />);
export const FaExclamationTriangle = createIcon(<path d="M12 3 1 21h22L12 3Zm1 14h-2v-2h2v2Zm0-4h-2V8h2v5Z" />);
export const FaInfoCircle = createIcon(<path d="M12 2a10 10 0 1 0 .01 0H12Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />);
export const FaPlane = createIcon(<path d="M21 16v2l-8-2.5V21h-2l-1-6.2L3 12V9.8l7 1.2L11 3h2l1 8 7-1.2V12l-6.9 2.8L21 16Z" />);
export const FaShieldAlt = createIcon(<path d="M12 2 5 5v6c0 4.6 3 8.8 7 10 4-1.2 7-5.4 7-10V5l-7-3Zm-1 13.5-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5Z" />);
