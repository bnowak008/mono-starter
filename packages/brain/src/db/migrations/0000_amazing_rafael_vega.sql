CREATE TABLE `ContextMetadata` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `key_idx` ON `ContextMetadata` (`key`);--> statement-breakpoint
CREATE TABLE `Rules` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rules_name_idx` ON `Rules` (`name`);--> statement-breakpoint
CREATE INDEX `rules_category_idx` ON `Rules` (`category`);--> statement-breakpoint
CREATE TABLE `Templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text,
	`type` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `templates_name_idx` ON `Templates` (`name`);--> statement-breakpoint
CREATE INDEX `templates_type_idx` ON `Templates` (`type`);