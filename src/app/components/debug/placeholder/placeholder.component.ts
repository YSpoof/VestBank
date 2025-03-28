import { Component } from '@angular/core';

@Component({
  selector: 'app-debug-placeholder',
  template: `<div class="p-4">
    <div class="animate-pulse">
      <div class="h-8 w-40 rounded mb-4">
        <h2 class="text-2xl font-bold mb-4">Users</h2>
      </div>
      <div class="overflow-x-auto mb-8">
        <table class="min-w-full bg-white border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left">Name</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Created At</th>
              <th class="px-6 py-3 text-left">Has Refresh Token</th>
            </tr>
          </thead>
          <tbody>
            @for(item of [1,2,3]; track item) {
            <tr class="border-t border-gray-300">
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-24"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-32"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-20"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-28"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-10"></div>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="h-8 w-40 rounded mb-4">
        <h2 class="text-2xl font-bold mb-4">Accounts</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left">Account ID</th>
              <th class="px-6 py-3 text-left">Owner</th>
              <th class="px-6 py-3 text-left">PiXi Key</th>
              <th class="px-6 py-3 text-left">Balance</th>
              <th class="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            @for(item of [1,2,3]; track item) {
            <tr class="border-t border-gray-300">
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-20"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-24"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-28"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-16"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-slate-200 rounded w-14"></div>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>`,
})
export class DebugPlaceholderComponent {}
