CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(50) NOT NULL,
	`email` text(255) NOT NULL,
	`password_hash` text(255) NOT NULL,
	`created_at` integer DEFAULT '{}' NOT NULL,
	`updated_at` integer DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);