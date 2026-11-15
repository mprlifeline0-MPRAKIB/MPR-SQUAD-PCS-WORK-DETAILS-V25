DWD Solution / MPR SQUAD™ Daily Work Details — Source v4.3

এই প্যাকেজে করা সংশোধন:
- হোমপেজে ব্যবহারকারীর সরবরাহ করা DWD/MPR SQUAD ব্যানার যুক্ত।
- Developer Information-এ ব্যবহারকারীর নির্বাচিত দ্বিতীয় ছবি, MP RAKIB, Founder & Lead Developer, ফোন 019090-62744 এবং ইমেইল mpr.lifeline0@gmail.com যুক্ত।
- নীল/নেভি/সায়ান/সোনালি রেফারেন্স-ভিত্তিক গাঢ় 3D কার্ড/থিম স্টাইল যুক্ত।
- চারটি preset theme রাখা হয়েছে এবং প্রধান, দ্বিতীয়, পটভূমি ও কার্ডের রং custom color picker দিয়ে বদলানোর ব্যবস্থা যুক্ত।
- লোকেশন সারাংশে শুধু ওই স্থানের বিল ও Duty রেকর্ডের কাজের সময়/দিন দেখানো হয়; ব্যক্তিগত খরচ বাদ।
- মেনু পুনর্বিন্যাস: Home, Office Contract (Mobile Bill, Salary, Bonus/Other), Stock Materials Notes, Settings/Developer, PDF/Report, Backup/Restore।
- Android launcher label DWD Solution; versionCode 43 / versionName 4.3।
- বিদ্যমান Duty/Leave, Expense, Person, Bill, Pay, Notes, Backup/Restore, PDF/Print, QR/Social, navigation ও অন্যান্য মডিউল সোর্সে অক্ষুণ্ণ রাখা হয়েছে।

যাচাই:
- HTML-এর inline JavaScript `node --check` দিয়ে syntax-check পাস করেছে।
- APK এই প্যাকেজে নেই এবং এখানে Android SDK/Gradle Build environment পাওয়া যায়নি; তাই APK build, Android install test, runtime functional test এখনো করা হয়নি।
- GitHub Actions workflow রাখা হয়েছে; GitHub repository-তে source push করে Actions থেকে Build চালালে debug APK artifact তৈরি হওয়ার কথা। Build সফল হয়েছে—এমন দাবি করা হচ্ছে না।
- Theme color customizer, location calculation ও নতুন visual integration-এর browser/device runtime test এখনো প্রয়োজন।

গুরুত্বপূর্ণ:
- এই ZIP হলো সংশোধিত source package, পরীক্ষিত APK নয়।
- আগের সকল ডেটা ও ফিচার অক্ষুণ্ণ রাখার লক্ষ্য নেওয়া হয়েছে; তবে বাস্তব ডিভাইসে সম্পূর্ণ regression test ছাড়া শতভাগ কার্যকারিতার নিশ্চয়তা দেওয়া যাবে না।
