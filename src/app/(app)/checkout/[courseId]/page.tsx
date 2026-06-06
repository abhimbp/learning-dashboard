import { createClient } from "@/utils/supabase/server";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MockCheckoutPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: course } = await supabase.from('available_courses').select('*').eq('id', courseId).single();
  
  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-20">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-surface-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Left Side: Order Summary */}
        <div className="p-8 md:p-12 bg-surface-800/50 flex flex-col justify-between">
          <div>
            <Link href={`/courses/${courseId}`} className="text-primary-400 hover:text-primary-300 text-sm font-medium mb-8 inline-block">
              ← Back to Course
            </Link>
            <h2 className="text-xl font-bold text-white mb-2">Order Summary</h2>
            <div className="flex gap-4 items-center mt-6">
              <img src={course.thumbnail_url} alt="thumbnail" className="w-24 h-16 object-cover rounded-xl shadow-md" />
              <div>
                <h3 className="font-bold text-white leading-tight">{course.title}</h3>
                <p className="text-sm text-gray-400 mt-1">By {course.instructor}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center text-lg mb-2">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-bold text-white">₹3999</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form (Mock) */}
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-2 mb-8 text-white">
            <ShieldCheck className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold">Secure Checkout</h2>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-xl text-sm mb-8">
            <strong>Developer Mode:</strong> Since Stripe keys are not configured, this is a simulated checkout. Clicking pay will bypass real payment and unlock the course.
          </div>

          <form action="/api/checkout/mock-purchase" method="POST" className="flex flex-col gap-5">
            <input type="hidden" name="courseId" value={courseId} />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 font-medium">Email Address</label>
              <input disabled type="email" value={user.email} className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 font-medium">Card Information</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input disabled type="text" value="•••• •••• •••• 4242" className="w-full bg-surface-800 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-gray-500 cursor-not-allowed font-mono tracking-widest" />
              </div>
            </div>

            <button type="submit" className="w-full py-4 mt-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              Pay ₹3999
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              By clicking "Pay", you agree to the EdgeLearn terms of service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
