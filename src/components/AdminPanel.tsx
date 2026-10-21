import React from 'react';
import { OwnerWorkspace } from './owner/OwnerWorkspace';

/**
 * @deprecated The monolithic AdminPanel has been replaced by the modular Sole Proprietor Workspace:
 * - CMS (Content Management System: products, categories, collections, homepage builder, banners, pages, media, SEO)
 * - CRM (Customer Relationship Management: customer profiles, support inbox, reviews, notifications, campaigns)
 * - Workshop Operations (Orders & fulfilment, inventory, cedar curing racks, dispatch, invoices, reports)
 */
export const AdminPanel: React.FC = () => {
  return <OwnerWorkspace />;
};

export default AdminPanel;
