import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#008083] text-white text-center p-4 fixed bottom-0">
      <p>&copy; {new Date().getFullYear()} Foodies Pvt Ltd. All rights reserved.</p>
    </footer>
  );
}