import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock,
  Send,
  AlertCircle,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

const BIDNOVA_API = import.meta.env.VITE_BIDNOVA_API || 'http://localhost:8000';

interface BidRequest {
  id: number;
  client_id: number;
  title: string;
  description: string;
  open: boolean;
  created_at: string;
}

interface Bid {
  id: number;
  request_id: number;
  contractor_id: number;
  price: number;
  message: string;
  accepted: boolean;
  created_at: string;
}

export function BidNovaManager() {
  const [userRole, setUserRole] = useState<'client' | 'contractor' | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [newRequest, setNewRequest] = useState({ title: '', description: '' });
  const [newBid, setNewBid] = useState({ requestId: 0, price: 0, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBidRequests();
  }, []);

  const loadBidRequests = async () => {
    try {
      const response = await fetch(`${BIDNOVA_API}/requests`);
      const data = await response.json();
      setBidRequests(data);
    } catch (err) {
      console.error('Failed to load bid requests:', err);
    }
  };

  const handleRegister = async (role: 'client' | 'contractor') => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BIDNOVA_API}/auth/register?email=${email}&role=${role}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      setUserToken(data.token);
      setUserRole(role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.description) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BIDNOVA_API}/requests?title=${encodeURIComponent(newRequest.title)}&description=${encodeURIComponent(newRequest.description)}&token=${userToken}`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to create request');
      
      setNewRequest({ title: '', description: '' });
      await loadBidRequests();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBid = async (requestId: number) => {
    if (!newBid.price || !newBid.message) {
      setError('Please fill in all bid details');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BIDNOVA_API}/bids?request_id=${requestId}&price=${newBid.price}&message=${encodeURIComponent(newBid.message)}&token=${userToken}`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to submit bid');
      
      setNewBid({ requestId: 0, price: 0, message: '' });
      alert('Bid submitted successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userRole) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <Card className="bg-gray-900/50 border-blue-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BidNova
              </span>
            </CardTitle>
            <CardDescription>
              Smart Contract Bidding & Project Management Platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-4">Choose your role to get started</p>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-md mx-auto bg-gray-800 border-gray-700"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30 cursor-pointer hover:border-blue-400/50 transition-all">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold">I'm a Client</h3>
                    <p className="text-sm text-gray-400">Post projects and receive bids from contractors</p>
                    <Button 
                      onClick={() => handleRegister('client')}
                      disabled={!email || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Register as Client
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 cursor-pointer hover:border-purple-400/50 transition-all">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Award className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold">I'm a Contractor</h3>
                    <p className="text-sm text-gray-400">Browse projects and submit competitive bids</p>
                    <Button 
                      onClick={() => handleRegister('contractor')}
                      disabled={!email || isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Register as Contractor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            BidNova Dashboard
          </h2>
          <p className="text-gray-400 mt-1">
            {userRole === 'client' ? 'Manage your projects and bids' : 'Browse and bid on projects'}
          </p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          {userRole === 'client' ? 'Client' : 'Contractor'}
        </Badge>
      </div>

      <Tabs defaultValue={userRole === 'client' ? 'my-requests' : 'available'}>
        <TabsList className="grid w-full grid-cols-2">
          {userRole === 'client' ? (
            <>
              <TabsTrigger value="my-requests">My Requests</TabsTrigger>
              <TabsTrigger value="create">Create New Request</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="available">Available Projects</TabsTrigger>
              <TabsTrigger value="my-bids">My Bids</TabsTrigger>
            </>
          )}
        </TabsList>

        {userRole === 'client' && (
          <TabsContent value="create" className="mt-6">
            <Card className="bg-gray-900/50 border-blue-500/20">
              <CardHeader>
                <CardTitle>Create New Bid Request</CardTitle>
                <CardDescription>Post a project and receive bids from contractors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Title</label>
                  <Input
                    placeholder="e.g., Website Development"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe your project requirements..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 min-h-[150px]"
                  />
                </div>
                <Button 
                  onClick={handleCreateRequest}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Post Request
                </Button>
                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value={userRole === 'client' ? 'my-requests' : 'available'} className="mt-6">
          <div className="grid gap-4">
            {bidRequests.filter(req => req.open).map((request) => (
              <Card key={request.id} className="bg-gray-900/50 border-blue-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{request.title}</h3>
                      <p className="text-gray-400 mb-3">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                          Open
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {userRole === 'contractor' && newBid.requestId !== request.id && (
                    <Button
                      onClick={() => setNewBid({ ...newBid, requestId: request.id })}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Submit Bid
                    </Button>
                  )}

                  {userRole === 'contractor' && newBid.requestId === request.id && (
                    <div className="space-y-3 mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <Input
                        type="number"
                        placeholder="Bid Price ($)"
                        value={newBid.price || ''}
                        onChange={(e) => setNewBid({ ...newBid, price: parseFloat(e.target.value) })}
                        className="bg-gray-800 border-gray-700"
                      />
                      <Textarea
                        placeholder="Your proposal message..."
                        value={newBid.message}
                        onChange={(e) => setNewBid({ ...newBid, message: e.target.value })}
                        className="bg-gray-800 border-gray-700"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmitBid(request.id)}
                          disabled={isLoading}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          Submit Bid
                        </Button>
                        <Button
                          onClick={() => setNewBid({ requestId: 0, price: 0, message: '' })}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {bidRequests.filter(req => req.open).length === 0 && (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-500">No open bid requests available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BidNovaManager;
