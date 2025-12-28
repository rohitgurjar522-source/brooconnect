export async function triggerOtp(mobile: string, purpose: 'signup' | 'forgot') {
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, purpose })
  });
  return await res.json();
}

export async function verifyAndCreateAccount(regData: any, otp: string) {
  // 1. Verify OTP
  const vRes = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile: regData.mobile, otp })
  });
  const vData = await vRes.json();
  if (!vData.verified) throw new Error(vData.message || "Invalid OTP code");

  // 2. Create Account
  const cRes = await fetch("/api/create-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(regData)
  });
  const cData = await cRes.json();
  if (!cData.success) throw new Error(cData.message || "Registration failed");

  // 3. Finalize Session
  localStorage.setItem('broo_user', JSON.stringify(cData.user));
  window.location.href = "/";
}

export async function verifyAndResetPin(mobile: string, otp: string, newPin: string) {
  // 1. Verify OTP
  const vRes = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, otp })
  });
  const vData = await vRes.json();
  if (!vData.verified) throw new Error("Verification failed");

  // 2. Reset PIN
  const rRes = await fetch("/api/reset-pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, newPin })
  });
  const rData = await rRes.json();
  if (!rData.success) throw new Error("Update failed");

  // 3. Auto Login
  localStorage.setItem('broo_user', JSON.stringify(rData.user));
  window.location.href = "/";
}