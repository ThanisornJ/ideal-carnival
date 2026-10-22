<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Requisition;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Demo Administrator',
                'password' => 'password',
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
        );

        $demoUser = User::query()->updateOrCreate(
            ['email' => 'demo.user@example.com'],
            [
                'name' => 'Demo User',
                'password' => 'password',
                'role' => 'user',
                'email_verified_at' => now(),
            ],
        );

        $equipment = [
            [
                'item_code' => 'EQ-001',
                'name' => 'Projector',
                'total_qty' => 5,
                'available_qty' => 4,
                'status' => 'available',
            ],
            [
                'item_code' => 'EQ-002',
                'name' => 'Wireless microphone',
                'total_qty' => 10,
                'available_qty' => 10,
                'status' => 'available',
            ],
            [
                'item_code' => 'EQ-003',
                'name' => 'Portable speaker',
                'total_qty' => 4,
                'available_qty' => 2,
                'status' => 'available',
            ],
            [
                'item_code' => 'EQ-004',
                'name' => 'HDMI cable',
                'total_qty' => 12,
                'available_qty' => 0,
                'status' => 'unavailable',
            ],
        ];

        foreach ($equipment as $item) {
            Equipment::query()->updateOrCreate(
                ['item_code' => $item['item_code']],
                $item,
            );
        }

        $demoRequisitions = [
            [
                'equipment_code' => 'EQ-001',
                'quantity' => 1,
                'reason' => 'Presentation for orientation',
                'status' => 'pending',
            ],
            [
                'equipment_code' => 'EQ-002',
                'quantity' => 2,
                'reason' => 'Student activity workshop',
                'status' => 'approved',
            ],
            [
                'equipment_code' => 'EQ-003',
                'quantity' => 1,
                'reason' => 'Department meeting',
                'status' => 'rejected',
            ],
        ];

        foreach ($demoRequisitions as $demoRequisition) {
            $equipmentItem = Equipment::query()
                ->where('item_code', $demoRequisition['equipment_code'])
                ->firstOrFail();

            Requisition::query()->updateOrCreate(
                [
                    'user_id' => $demoUser->id,
                    'equipment_id' => $equipmentItem->id,
                    'reason' => $demoRequisition['reason'],
                ],
                [
                    'quantity' => $demoRequisition['quantity'],
                    'status' => $demoRequisition['status'],
                ],
            );
        }
    }
}
