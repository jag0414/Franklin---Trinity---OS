import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, TrendingUp, PieChart, CreditCard,
  CheckCircle, AlertCircle, Info, ArrowRight,
  Zap, Shield, Sparkles
} from 'lucide-react';

interface PricingTier {
  name: string;
  price: number | string;
  features: string[];
  recommended?: boolean;
}

const TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Unlimited chat (no cost)',
      '1,000 tokens/day for tasks',
      'Basic AI models',
      'Community support'
    ]
  },
  {
    name: 'Basic',
    price: 10,
    features: [
      'Everything in Free',
      '100,000 tokens/day',
      'All AI providers',
      'Priority support',
      'Export to all formats'
    ]
  },
  {
    name: 'Pro',
    price: 50,
    recommended: true,
    features: [
      'Everything in Basic',
      '1,000,000 tokens/day',
      'Hybrid agents',
      'Advanced analytics',
      'API access',
      'Custom integrations'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Unlimited tokens',
      'Dedicated support',
      'Custom deployment',
      'SLA guarantees',
      'White-label option'
    ]
  }
];

const MonetizationDashboard: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('Free');
  const [taskComplexity, setTaskComplexity] = useState<any>(null);
  const [usage, setUsage] = useState({
    tokensUsed: 12450,
    tokensLimit: 100000,
    tasksCompleted: 127,
    totalSpent: 3.42
  });

  const analyzeTask = async (prompt: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/oracle/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, provider: 'openai' })
      });
      const data = await response.json();
      setTaskComplexity(data.analysis);
    } catch (error) {
      console.error('Failed to analyze task:', error);
    }
  };

  const usagePercentage = (usage.tokensUsed / usage.tokensLimit) * 100;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Pricing & Monetization
        </h2>
        <p className="text-gray-400">Transparent, task-based pricing with detailed cost breakdowns</p>
      </div>

      {/* Current Usage */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Your Usage - {selectedTier} Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{usage.tokensUsed.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-1">Tokens Used</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{usage.tasksCompleted}</div>
              <div className="text-sm text-gray-400 mt-1">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">${usage.totalSpent.toFixed(2)}</div>
              <div className="text-sm text-gray-400 mt-1">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{usagePercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-400 mt-1">Plan Usage</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Daily Token Limit</span>
              <span className="text-gray-300">{usage.tokensUsed.toLocaleString()} / {usage.tokensLimit.toLocaleString()}</span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {TIERS.map(tier => (
          <Card 
            key={tier.name}
            className={`relative overflow-hidden transition-all ${
              tier.recommended
                ? 'bg-gradient-to-b from-purple-900/50 to-gray-900/80 border-purple-500'
                : 'bg-gray-900/80 border-gray-700'
            } backdrop-blur-xl ${
              selectedTier === tier.name ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {tier.recommended && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-bl-lg">
                Recommended
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="text-4xl font-bold mt-2">
                {typeof tier.price === 'number' ? (
                  <>
                    ${tier.price}
                    <span className="text-base font-normal text-gray-400">/mo</span>
                  </>
                ) : (
                  <span className="text-2xl">{tier.price}</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => setSelectedTier(tier.name)}
                className={`w-full ${
                  tier.recommended
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : selectedTier === tier.name
                    ? 'bg-blue-600'
                    : ''
                }`}
                variant={selectedTier === tier.name || tier.recommended ? 'default' : 'outline'}
              >
                {selectedTier === tier.name ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-400" />
              Provider Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'OpenAI GPT-4', cost: 0.03, tokens: 1000, color: 'bg-green-500' },
                { name: 'Anthropic Claude', cost: 0.03, tokens: 1000, color: 'bg-purple-500' },
                { name: 'Google Gemini', cost: 0.01, tokens: 1000, color: 'bg-blue-500' },
                { name: 'Local Llama', cost: 0.00, tokens: 1000, color: 'bg-yellow-500' },
                { name: 'Local Mistral', cost: 0.00, tokens: 1000, color: 'bg-orange-500' }
              ].map((provider, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                      <span className="text-sm font-medium">{provider.name}</span>
                    </div>
                    <Badge variant="outline">
                      ${provider.cost}/1k tokens
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 ml-5">
                    {provider.cost === 0 ? 'Free - No API costs' : 'High quality, cloud-based'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Complexity Analyzer */}
        <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Oracle Cost Estimator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Enter your task to get cost estimate
                </label>
                <textarea
                  className="w-full h-24 bg-gray-950/50 border border-gray-700 rounded-lg p-3 text-sm"
                  placeholder="e.g., Analyze this dataset and create a comprehensive report..."
                  onChange={(e) => {
                    if (e.target.value.length > 20) {
                      analyzeTask(e.target.value);
                    }
                  }}
                />
              </div>

              {taskComplexity && (
                <div className="bg-gray-950/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Complexity Score</span>
                    <Badge className="bg-purple-600">
                      {taskComplexity.complexity_score}/100
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Estimated Tokens</span>
                    <span className="text-sm font-medium">{taskComplexity.estimated_tokens}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Estimated Time</span>
                    <span className="text-sm font-medium">{taskComplexity.estimated_time_seconds}s</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-400">Estimated Cost</span>
                      <span className="text-xl font-bold text-green-400">
                        ${taskComplexity.final_cost?.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    <Info className="w-3 h-3 inline mr-1" />
                    Cost breakdown by provider available in detailed view
                  </div>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="text-blue-300">
                    <strong>Free Chat:</strong> Chat interface is always free. 
                    Costs only apply when executing tasks.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="bg-gray-900/80 backdrop-blur-xl border-gray-700 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-pink-400" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'Credit Card', icon: CreditCard, status: 'active' },
              { name: 'PayPal', icon: Shield, status: 'available' },
              { name: 'Crypto', icon: Zap, status: 'coming soon' },
              { name: 'Invoice', icon: DollarSign, status: 'enterprise' }
            ].map((method, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border text-center ${
                  method.status === 'active'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <method.icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <div className="text-sm font-medium">{method.name}</div>
                <Badge variant="outline" className="mt-2 text-xs">
                  {method.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonetizationDashboard;
