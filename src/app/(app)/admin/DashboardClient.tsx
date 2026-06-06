"use client";

import { useState } from "react";
import { PlusCircle, ShoppingCart, Users, Star, MessageSquare, Reply, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BentoTile } from "@/components/dashboard/BentoGrid";
import Link from "next/link";
import { replyToReview } from "./actions";
import { cn } from "@/lib/utils";

// Mock chart data (we will aggregate from purchases ideally, but hardcoding a nice shape for demo)
const chartData = [
  { name: '01 May', total: 1200 },
  { name: '05 May', total: 2100 },
  { name: '10 May', total: 1800 },
  { name: '15 May', total: 3200 },
  { name: '20 May', total: 2800 },
  { name: '25 May', total: 4500 },
  { name: '30 May', total: 5200 },
];

export function DashboardClient({ 
  courses, 
  purchases, 
  reviews 
}: { 
  courses: any[], 
  purchases: any[], 
  reviews: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'purchases' | 'reviews'>('overview');
  
  const totalSales = purchases.length * 3999; // ₹3999 per course
  const totalStudents = new Set(purchases.map(p => p.user_id)).size;
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/5 pb-2">
        <button onClick={() => setActiveTab('overview')} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap", activeTab === 'overview' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>Overview</button>
        <button onClick={() => setActiveTab('courses')} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap", activeTab === 'courses' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>Manage Courses</button>
        <button onClick={() => setActiveTab('purchases')} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap", activeTab === 'purchases' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>Students & Purchases</button>
        <button onClick={() => setActiveTab('reviews')} className={cn("px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap", activeTab === 'reviews' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>Course Reviews</button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoTile className="p-6 bg-surface-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/10 text-green-400 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Earnings</p>
                  <h3 className="text-3xl font-bold text-white">₹{totalSales.toLocaleString()}</h3>
                </div>
              </div>
            </BentoTile>
            <BentoTile className="p-6 bg-surface-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Users className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Students</p>
                  <h3 className="text-3xl font-bold text-white">{totalStudents}</h3>
                </div>
              </div>
            </BentoTile>
            <BentoTile className="p-6 bg-surface-900/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl"><Star className="w-6 h-6 fill-yellow-400" /></div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Average Rating</p>
                  <h3 className="text-3xl font-bold text-white">{avgRating} <span className="text-sm text-gray-500">({reviews.length})</span></h3>
                </div>
              </div>
            </BentoTile>
          </div>

          <BentoTile className="p-6 md:p-8 bg-surface-900/50 min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6">Revenue Growth</h3>
            <div className="h-[300px] w-full min-h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BentoTile>
        </div>
      )}

      {/* COURSES TAB (Moved from old page) */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Published Courses</h2>
            <div className="flex flex-col gap-3">
              {courses?.map(course => (
                <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-900/40 rounded-2xl border border-white/5 gap-4">
                  <div className="flex items-center gap-4">
                    <img src={course.thumbnail_url} className="w-16 h-12 object-cover rounded-lg" alt="Thumbnail" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{course.title}</h4>
                      <p className="text-xs text-gray-500">{course.instructor} • {course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">Published</div>
                    <Link href={`/admin/courses/${course.id}`} className="px-4 py-1.5 bg-surface-800 hover:bg-surface-700 text-white rounded-lg text-xs font-medium transition-colors border border-white/10">
                      Edit Content
                    </Link>
                  </div>
                </div>
              ))}
              {(!courses || courses.length === 0) && (
                <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl">
                  No courses published yet.
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1">
             <Link href="/admin/courses/new" className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors shadow-lg">
               <PlusCircle className="w-5 h-5" /> Create New Course
             </Link>
             <p className="text-xs text-gray-500 text-center mt-4">For creating a course, refer to the Create Course page.</p>
          </div>
        </div>
      )}

      {/* PURCHASES TAB */}
      {activeTab === 'purchases' && (
        <BentoTile className="p-6 bg-surface-900/50">
          <h2 className="text-xl font-bold text-white mb-6">Recent Purchases</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-4 pr-4">Student</th>
                  <th className="pb-4 pr-4">Email</th>
                  <th className="pb-4 pr-4">Course</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? purchases.map((purchase) => {
                  const course = courses.find(c => c.id === purchase.course_id);
                  return (
                    <tr key={purchase.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-4 text-sm font-medium text-white">{purchase.student_name || "Anonymous"}</td>
                      <td className="py-4 pr-4 text-sm text-gray-400">{purchase.student_email || "N/A"}</td>
                      <td className="py-4 pr-4 text-sm text-white">{course?.title || "Unknown Course"}</td>
                      <td className="py-4 text-sm text-gray-400">{new Date(purchase.created_at).toLocaleDateString()}</td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">No purchases found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </BentoTile>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <BentoTile className="p-6 bg-surface-900/50">
          <h2 className="text-xl font-bold text-white mb-6">Student Feedback</h2>
          <div className="flex flex-col gap-4">
            {reviews.length > 0 ? reviews.map(review => {
              const course = courses.find(c => c.id === review.course_id);
              return (
                <div key={review.id} className="p-5 bg-surface-800 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm">{review.student_name || "Student"}</h4>
                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-surface-900 rounded-md">{course?.title}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600")} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="text-sm text-gray-300 bg-surface-900 p-4 rounded-xl border border-white/5 mb-4">"{review.comment}"</p>
                  
                  {review.reply ? (
                    <div className="ml-8 p-4 bg-primary-500/10 border-l-2 border-primary-500 rounded-r-xl relative">
                      <Reply className="w-4 h-4 text-primary-500 absolute -left-6 top-4 rotate-180" />
                      <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">Your Reply</p>
                      <p className="text-sm text-gray-300">{review.reply}</p>
                    </div>
                  ) : (
                    <div className="ml-8 mt-2">
                      <form action={async (formData) => { await replyToReview(formData); }} className="flex gap-2">
                        <input type="hidden" name="review_id" value={review.id} />
                        <input name="reply" required placeholder="Type a reply..." className="flex-1 px-4 py-2 bg-surface-900 rounded-lg text-sm text-white focus:outline-none border border-white/5 focus:border-primary-500 transition-colors" />
                        <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Reply
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="py-8 text-center text-gray-500 text-sm">No reviews found.</div>
            )}
          </div>
        </BentoTile>
      )}

    </div>
  );
}
