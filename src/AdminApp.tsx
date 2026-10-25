import React, { useState } from "react";
import { storeService } from "./services/storeService";
import { OrderStatus, Product } from "./types/store";
import AdminHeader, { AdminTab } from "./components/backend/AdminHeader";
import NativeAnalyticsView from "./components/backend/NativeAnalyticsView";
import OrdersManagementView from "./components/backend/OrdersManagementView";
import CustomersManagementView from "./components/backend/CustomersManagementView";
import ProductsManagementView from "./components/backend/ProductsManagementView";
import InfrastructureSettingsView from "./components/backend/InfrastructureSettingsView";
import AppEcosystemView from "./components/backend/AppEcosystemView";

export default function AdminApp() {
  const [storeData, setStoreData] = useState(() => storeService.getState());
  const [backendTab, setBackendTab] = useState<AdminTab>("relatorios");

  const refreshData = () => {
    setStoreData(storeService.getState());
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    storeService.updateOrderStatus(orderId, status);
    refreshData();
  };

  const handleProcessRefund = (orderId: string) => {
    storeService.processRefund(orderId);
    refreshData();
  };

  const handleSaveProduct = (product: Product) => {
    storeService.saveProduct(product);
    refreshData();
  };

  const handleDeleteProduct = (productId: string) => {
    storeService.deleteProduct(productId);
    refreshData();
  };

  const handleToggleGateway = (gatewayId: string) => {
    storeService.toggleGateway(gatewayId);
    refreshData();
  };

  const handleToggleChannel = (channelId: string) => {
    storeService.toggleSalesChannel(channelId);
    refreshData();
  };

  const handleToggleApp = (appId: string) => {
    storeService.toggleApp(appId);
    refreshData();
  };

  const handleResetData = () => {
    const reset = storeService.resetDatabase();
    setStoreData(reset);
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const totalStoreRevenue = storeData.orders
    .filter((o) => o.status !== "Cancelado" && o.status !== "Reembolsado")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-stone-100/60 text-[#3A3A30] font-sans flex flex-col">
      <AdminHeader
        currentTab={backendTab}
        onSelectTab={setBackendTab}
        onSwitchToFrontend={handleGoHome}
        onResetData={handleResetData}
        totalOrders={storeData.orders.length}
        totalRevenue={totalStoreRevenue}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {backendTab === "relatorios" && (
          <NativeAnalyticsView
            dailySales={storeData.dailySales}
            trafficSources={storeData.trafficSources}
            orders={storeData.orders}
          />
        )}

        {backendTab === "pedidos" && (
          <OrdersManagementView
            orders={storeData.orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onProcessRefund={handleProcessRefund}
          />
        )}

        {backendTab === "clientes" && (
          <CustomersManagementView
            customers={storeData.customers}
            orders={storeData.orders}
          />
        )}

        {backendTab === "produtos" && (
          <ProductsManagementView
            products={storeData.products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {backendTab === "infraestrutura" && (
          <InfrastructureSettingsView
            gateways={storeData.gateways}
            channels={storeData.channels}
            onToggleGateway={handleToggleGateway}
            onToggleChannel={handleToggleChannel}
          />
        )}

        {backendTab === "apps" && (
          <AppEcosystemView
            apps={storeData.apps}
            onToggleApp={handleToggleApp}
          />
        )}
      </main>

      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-400 font-mono">
        Teríus Central de Controle Administrativo • Versão 3.0 • Conexão Segura
      </footer>
    </div>
  );
}
