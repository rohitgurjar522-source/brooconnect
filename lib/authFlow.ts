export async function sendOtp(phone: string) {
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  return await res.json();
}

export async function verifyOtpAndLogin(
  name: string,
  phone: string,
  age: string,
  city: string,
  pin: string,
  otp: string,
  pincode?: string,
  email?: string
) {
  // 1. Verify OTP
  const verifyRes = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp })
  });

  const verifyData = await verifyRes.json();
  if (!verifyData.verified) {
    throw new Error(verifyData.message || "Invalid OTP");
  }

  // 2. Create account (PIN is hashed on server)
  const createRes = await fetch("/api/create-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, age, city, pin, pincode, email })
  });

  const createData = await createRes.json();
  if (!createData.success) {
    throw new Error(createData.message || "Account creation failed");
  }

  // 3. Save session
  localStorage.setItem('broo_user', JSON.stringify(createData.user));

  // 4. FORCE dashboard open
  window.location.href = "/";
}

export async function verifyOtpAndResetPin(
  phone: string,
  otp: string,
  newPin: string
) {
  const verifyRes = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp })
  });

  const verifyData = await verifyRes.json();
  if (!verifyData.verified) {
    throw new Error("Invalid OTP");
  }

  const resetRes = await fetch("/api/reset-pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile: phone, newPin })
  });

  const resetData = await resetRes.json();
  if (!resetData.success) {
    throw new Error("Failed to reset PIN");
  }

  localStorage.setItem('broo_user', JSON.stringify(resetData.user));
  window.location.href = "/";
}