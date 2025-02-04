import React from 'react';

const PrivacyPolicy = () => {
    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const headingStyle = {
        color: '#004085',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const subheadingStyle = {
        color: '#0056b3',
        marginBottom: '15px',
    };

    const paragraphStyle = {
        marginBottom: '15px',
    };

    const contactInfoStyle = {
        fontStyle: 'italic',
        color: '#555',
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Privacy Policy</h2>
            <p style={paragraphStyle}>
                Your privacy is important to us. This Privacy Policy outlines how we handle your personal information, including your mobile number.
            </p>

            <h3 style={subheadingStyle}>Collection and Use of Mobile Information</h3>
            <p style={paragraphStyle}>
                We collect your mobile number for the purpose of providing you with services such as account verification, notifications, and updates. We may also use your mobile number to send automated marketing text messages with your consent.
            </p>

            <h3 style={subheadingStyle}>No Sharing with Third Parties for Marketing/Promotional Purposes</h3>
            <p style={paragraphStyle}>
                We do not share your mobile number or any other personal information with third parties or affiliates for marketing or promotional purposes. Your information is kept strictly confidential and is used solely for the purposes stated in this policy.
            </p>

            <h3 style={subheadingStyle}>Information Sharing with Subcontractors</h3>
            <p style={paragraphStyle}>
                We may share your information with subcontractors who provide support services, such as customer service or technical support, to help us deliver our services to you. These subcontractors are contractually obligated to keep your information confidential and to use it only for the purposes of providing the services we request.
            </p>

            <h3 style={subheadingStyle}>Exclusion of Text Messaging Originator Opt-in Data and Consent</h3>
            <p style={paragraphStyle}>
                The information you provide through text messaging originator opt-ins, including your mobile number, will not be shared with any third parties except as necessary to provide the services described above. We respect your privacy and will not use your consent data for any other purpose.
            </p>

            <h3 style={subheadingStyle}>Changes to This Privacy Policy</h3>
            <p style={paragraphStyle}>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review this policy regularly to stay informed about how we protect your personal information.
            </p>

            <p style={{ ...paragraphStyle, ...contactInfoStyle }}>
                If you have any questions about this Privacy Policy, please contact us at
                <a href="mailto:ashok.mamilla12@gmail.com" style={{ color: '#0056b3', textDecoration: 'none', marginLeft: '10px' }}>
                    ashok.mamilla12@gmail.com
                </a>.
            </p>

        </div>
    );
};

export default PrivacyPolicy;