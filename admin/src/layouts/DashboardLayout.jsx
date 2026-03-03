import React from 'react'
import { Outlet } from 'react-router'

function DashboardLayout() {
  return (
    <div>
         {/* sidebar and nav bar components */}
        <h1>sidebar</h1>
        <h1>navbar</h1>

        {/* content */}
        <Outlet/>
    </div>
  );
}

export default DashboardLayout;