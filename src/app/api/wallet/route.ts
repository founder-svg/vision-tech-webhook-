import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    currency: 'INR',
    balance: 4250.00,
    creditThresholdAlert: 500.00,
    metaAccountId: 'ACT-9021940192',
    accountStatus: 'ACTIVE',
    billingCycle: 'Prepaid Meta Business Wallet',
    lastTopUpDate: '2026-09-04 14:30'
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid recharge amount' }, { status: 400 });
    }

    const txId = `META-PAY-${Date.now()}`;

    return NextResponse.json({
      success: true,
      transactionId: txId,
      rechargedAmount: amount,
      newBalance: 4250.00 + amount,
      paymentMethod: paymentMethod || 'Razorpay / Meta Business Billing',
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Recharge transaction failed' }, { status: 500 });
  }
}
