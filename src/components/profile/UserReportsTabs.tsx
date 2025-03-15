
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ReportItem from './ReportItem';

interface UserReportsTabsProps {
  wasteReports: any[];
  floodReports: any[];
  electricityReports: any[];
  formatDate: (dateStr: string) => string;
  deleteReport: (reportType: string, reportId: string) => void;
}

const UserReportsTabs: React.FC<UserReportsTabsProps> = ({
  wasteReports,
  floodReports,
  electricityReports,
  formatDate,
  deleteReport,
}) => {
  const navigate = useNavigate();
  const getTotalReports = () => {
    return wasteReports.length + floodReports.length + electricityReports.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reports</CardTitle>
        <CardDescription>
          All reports you've submitted across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
            <TabsTrigger value="flood">Flood</TabsTrigger>
            <TabsTrigger value="electricity">Electricity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {getTotalReports() === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't submitted any reports yet</p>
                <Button className="mt-4" onClick={() => navigate('/waste')}>
                  Make Your First Report
                </Button>
              </div>
            ) : (
              <>
                {wasteReports.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Waste Reports</h3>
                    {wasteReports.map(report => (
                      <ReportItem 
                        key={report.id} 
                        report={report} 
                        reportType="waste" 
                        onDelete={deleteReport} 
                        formatDate={formatDate} 
                      />
                    ))}
                  </div>
                )}
                
                {floodReports.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Flood Reports</h3>
                    {floodReports.map(report => (
                      <ReportItem 
                        key={report.id} 
                        report={report} 
                        reportType="flood" 
                        onDelete={deleteReport} 
                        formatDate={formatDate} 
                      />
                    ))}
                  </div>
                )}
                
                {electricityReports.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Electricity Reports</h3>
                    {electricityReports.map(report => (
                      <ReportItem 
                        key={report.id} 
                        report={report} 
                        reportType="electricity" 
                        onDelete={deleteReport} 
                        formatDate={formatDate} 
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="waste" className="space-y-4">
            {wasteReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No waste reports yet</p>
                <Button className="mt-4" onClick={() => navigate('/waste')}>
                  Report Waste
                </Button>
              </div>
            ) : (
              wasteReports.map(report => (
                <ReportItem 
                  key={report.id} 
                  report={report} 
                  reportType="waste" 
                  onDelete={deleteReport} 
                  formatDate={formatDate} 
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="flood" className="space-y-4">
            {floodReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No flood reports yet</p>
                <Button className="mt-4" onClick={() => navigate('/flood')}>
                  Report Flooding
                </Button>
              </div>
            ) : (
              floodReports.map(report => (
                <ReportItem 
                  key={report.id} 
                  report={report} 
                  reportType="flood" 
                  onDelete={deleteReport} 
                  formatDate={formatDate} 
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="electricity" className="space-y-4">
            {electricityReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No electricity reports yet</p>
                <Button className="mt-4" onClick={() => navigate('/electricity')}>
                  Report Electricity Issues
                </Button>
              </div>
            ) : (
              electricityReports.map(report => (
                <ReportItem 
                  key={report.id} 
                  report={report} 
                  reportType="electricity" 
                  onDelete={deleteReport} 
                  formatDate={formatDate} 
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserReportsTabs;
