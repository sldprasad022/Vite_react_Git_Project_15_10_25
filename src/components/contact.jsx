import React from "react";

const Contact = () => {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us for any questions or feedback.</p>
      <div>
        <h2>Contact Information</h2>
        <p>Email: contact@example.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Main Street, City, Country</p>
      </div>
      <div>
        <h2>Send us a message</h2>
        <form>
          <div>
            <label>Name:</label>
            <input type="text" placeholder="Your name" />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" placeholder="Your email" />
          </div>
          <div>
            <label>Message:</label>
            <textarea placeholder="Your message"></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
