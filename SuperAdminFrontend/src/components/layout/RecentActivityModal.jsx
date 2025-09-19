// src/components/RecentActivityModal.jsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const getLogStatusColor = (status) => {
  switch (status) {
    case "Success":
      return "bg-success text-success-foreground";
    case "Failed":
      return "bg-red-400 text-red-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const RecentActivityModal = ({ open, onClose, logs }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>All Recent Activities</DialogTitle>
          <DialogDescription>
            Full list of system logs and actions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.log_id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="font-medium">{log.action_title}</p>
                    <p className="text-sm text-muted-foreground">{log.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getLogStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No logs available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecentActivityModal;
