import React, { useState  , useContext , useEffect} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  UserCheck,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { use } from 'react';
import { SuperAdminDataContext } from '../context_api/SuperAdminDataState';
import AdminCreationModal from '../components/layout/AdminCreationModal';

const AdminManagement = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [openCreationModal, setOpenCreationModal] = useState(false);

  const {getAllAdmins}  = useContext(SuperAdminDataContext);
  const [admins, setAdmins] = useState([]);

    useEffect(() => {
    const fetchAdmins = async () => {
      const data = await getAllAdmins();
      setAdmins(data); // ✅ store backend data
    };
    fetchAdmins();
  }, []);

  const states = [
    'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Telangana', 'Karnataka', 
    'Tamil Nadu', 'Rajasthan', 'West Bengal', 'Madhya Pradesh', 'Punjab'
  ];

 const filteredAdmins = admins.filter(admin => {
  const matchesSearch =
    (admin.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (admin.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (admin.state?.toLowerCase() || "").includes(searchTerm.toLowerCase());

  const matchesState = stateFilter === "all" || admin.state === stateFilter;

  return matchesSearch && matchesState;
});


  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-success text-success-foreground' 
      : 'bg-warning text-warning-foreground';
  };

  return (
<div className="space-y-6 px-4 md:px-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground">
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage state-level administrators across India
          </p>
        </div>
       <Button 
  className="bg-gradient-primary hover:bg-primary-hover"
  onClick={() => setOpenCreationModal(true)}
>
  <Plus className="w-4 h-4 mr-2" />
  Create New Admin
</Button>
      <AdminCreationModal
        open={openCreationModal}
        onClose={setOpenCreationModal}
        elections={[]}
        onSubmit={(data) => {
          // Handle form submission, e.g., call API to create admin
          console.log("Form Data Submitted:", data);
        }}
      />

      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Registered State Election Administrators
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAdmins.length}</div>
            <p className="text-xs text-muted-foreground">
            Across all states
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Administrator
            </CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              89% online rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Elections Managed
            </CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              This quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              -30% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admins List */}
      <Card>
        <CardHeader>
          <CardTitle>State Administrators ({filteredAdmins.length})</CardTitle>
          <CardDescription>
            Comprehensive list of all state-level admin accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
<div key={admin.admin_id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-smooth gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                      {admin.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{admin.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{admin.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{admin.admin_of_state}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="text-left sm:text-right space-y-1">
                    <Badge className={getStatusColor(admin.status)}>
                      {admin.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {admin.electionsManaged} elections managed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {admin.lastActive}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No admins found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or create a new admin
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
