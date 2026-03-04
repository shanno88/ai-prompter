import React, { useState } from 'react';
import { Crown, X, Star, Zap, Check } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'monthly',
      name: '月度 Pro',
      price: '$29',
      period: '/月',
      badge: null,
      features: [
        '无限使用所有功能',
        'AI 违禁词检测',
        'AI 播感标注',
        'AI 智能改写',
        '导出 Word/JSON',
        '优先技术支持'
      ]
    },
    {
      id: 'yearly',
      name: '年度 Pro',
      price: '¥199',
      period: '/年',
      badge: '超值推荐',
      features: [
        '月度 Pro 所有功能',
        '节省 ¥149（相当于 ¥16/月）',
        '专属客服通道',
        '新功能优先体验',
        '年度数据报告',
        '可随时取消'
      ]
    }
  ];

  const handleSubscribe = async (planId) => {
    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      await onSubscribe(planId);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-[#EFF6FF] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2">解锁 Pro 无限功能</h2>
          <p className="text-sm text-white/90 opacity-90">告别限制，尽情创作</p>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => !isProcessing && handleSubscribe(plan.id)}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all
                  ${selectedPlan === plan.id
                    ? 'border-[#3B82F6] bg-[#F9FAFB] shadow-lg scale-105'
                    : 'border-[#EFF6FF] hover:border-[#BFDBFE] hover:shadow-md'
                  }
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A855F7] text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-4">
                  <p className="text-sm font-bold text-gray-600 mb-1">{plan.name}</p>
                  <p className="text-4xl font-black text-gray-800">
                    {plan.price}
                    <span className="text-base font-normal text-gray-500">{plan.period}</span>
                  </p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[#DBEAFE] border border-[#FFD54F] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#FFE082] rounded-full flex items-center justify-center flex-shrink-0">
                <Star size={16} className="text-[#A855F7]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#A855F7] mb-1">免费试用</p>
                <p className="text-xs text-[#F59E0B]">
                  新用户注册后自动获得 3 天试用期，期间可使用完整功能。
                  试用期结束后需要订阅才能继续使用。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-2">
              支持微信支付、支付宝、信用卡等多种支付方式
            </p>
            <p className="text-[10px] text-gray-400">
              订阅可随时取消。取消后当前计费周期结束前仍可使用 Pro 功能。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
