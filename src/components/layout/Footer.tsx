import Link from "next/link";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-border pt-10 pb-16 px-4 md:px-8 text-xs text-gray-500 dark:text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-border pb-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="px-4 py-1.5 rounded-full border border-border hover:bg-surface-800 transition-colors">Dashboard</Link>
            <Link href="/explore" className="px-4 py-1.5 rounded-full border border-border hover:bg-surface-800 transition-colors">Explore Courses</Link>
            <Link href="/profile" className="px-4 py-1.5 rounded-full border border-border hover:bg-surface-800 transition-colors">Your Profile</Link>
            <Link href="/analytics" className="px-4 py-1.5 rounded-full border border-border hover:bg-surface-800 transition-colors">Analytics</Link>
          </div>
        </div>

        <p className="mb-6 pb-6 border-b border-border">
          We use your learning progress to personalize your dashboard. We found your location using your IP address or because you entered it during a previous visit to EdgeLearn.
        </p>

        <div className="flex items-center gap-2 mb-6 font-medium text-foreground">
          <span className="text-sm">🎓</span>
          <span>EdgeLearn Platform</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-foreground mb-1">Learn and Grow</h4>
            <Link href="/explore" className="hover:underline">All Courses</Link>
            <Link href="/explore?category=tech" className="hover:underline">Technology</Link>
            <Link href="/explore?category=business" className="hover:underline">Business</Link>
            <Link href="/explore?category=design" className="hover:underline">Design</Link>
            <Link href="/explore?category=science" className="hover:underline">Science</Link>
            <Link href="/explore?category=math" className="hover:underline">Mathematics</Link>
            <Link href="/explore?category=art" className="hover:underline">Arts & Humanities</Link>
            <h4 className="font-bold text-foreground mt-4 mb-1">Certifications</h4>
            <Link href="/certifications" className="hover:underline">Professional Certificates</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-foreground mb-1">Account</h4>
            <Link href="/profile" className="hover:underline">Manage Your Account</Link>
            <Link href="/settings" className="hover:underline">Account Settings</Link>
            <Link href="/billing" className="hover:underline">Billing History</Link>
            
            <h4 className="font-bold text-foreground mt-4 mb-1">Learning</h4>
            <Link href="/courses" className="hover:underline">My Courses</Link>
            <Link href="/analytics" className="hover:underline">My Progress</Link>
            <Link href="/bookmarks" className="hover:underline">Saved Items</Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-foreground mb-1">For Instructors</h4>
            <Link href="/admin" className="hover:underline">Instructor Dashboard</Link>
            <Link href="/admin/courses/new" className="hover:underline">Create a Course</Link>
            <Link href="/admin/guidelines" className="hover:underline">Teaching Guidelines</Link>
            <Link href="/admin/revenue" className="hover:underline">Revenue & Payouts</Link>
            <Link href="/admin/support" className="hover:underline">Instructor Support</Link>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-foreground mb-1">For Business</h4>
            <Link href="/business" className="hover:underline">EdgeLearn for Business</Link>
            
            <h4 className="font-bold text-foreground mt-4 mb-1">For Education</h4>
            <Link href="/education" className="hover:underline">EdgeLearn for Universities</Link>
            <Link href="/k12" className="hover:underline">EdgeLearn for K-12</Link>
          </div>

          {/* Column 5 */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-foreground mb-1">Platform Values</h4>
            <Link href="/accessibility" className="hover:underline">Accessibility</Link>
            <Link href="/environment" className="hover:underline">Environment</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            
            <h4 className="font-bold text-foreground mt-4 mb-1">About Us</h4>
            <Link href="/about" className="hover:underline">Newsroom</Link>
            <Link href="/leadership" className="hover:underline">Leadership</Link>
            <Link href="/careers" className="hover:underline">Career Opportunities</Link>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
