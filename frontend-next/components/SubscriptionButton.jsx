import React from 'react';
import { ShoppingCart, Crown, CheckCircle } from 'lucide-react';

const SubscriptionButton = ({ onUpgrade, subscription }) => {
  const { isPro, planType, subscriptionEnd, trialEnd, dailyCreditsUsed, dailyCreditsLimit } = subscription;

  if (isPro) {
    const endDate = new Date(subscriptionEnd);
    const formattedDate = endDate.toLocaleDateString('zh-CN');

    return (
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
        <Crown size={16} />
        <div>
          <p className="text-xs font-bold opacity-90">Pro 会员</p>
          <p className="text-[10px] opacity-75">有效期至 {formattedDate}</p>
        </div>
        <CheckCircle size={16} className="ml-auto text-[#10B981]" />
      </div>
    );
  }

  if (trialEnd && new Date(trialEnd) > new Date()) {
    const daysLeft = Math.ceil((new Date(trialEnd) - new Date()) / (1000 * 60 * 60 * 24));
    const creditsLeft = dailyCreditsLimit - dailyCreditsUsed;

    return (
      <div className="bg-[#10B981] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer hover:bg-[#6BC847] transition-colors"
           onClick={() => onUpgrade()}>
        <ShoppingCart size={16} />
        <div className="flex-1">
          <p className="text-xs font-bold">试用中</p>
          <p className="text-[10px] opacity-90">剩 {daysLeft} 天 · {creditsLeft} 点数</p>
        </div>
        <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-[10px] font-bold transition-colors">
          升级
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => onUpgrade()}
      className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
    >
      <Crown size={16} />
      <span className="text-xs font-bold">升级 Pro</span>
    </button>
  );
};

export default SubscriptionButton;
