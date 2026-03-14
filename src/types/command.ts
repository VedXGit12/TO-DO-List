import type { Todo } from "./todo";

export interface TodoCommand {
  type: "todo";
  id: string;
  title: string;
  projectName: string;
  status: Todo["status"];
  priority: Todo["priority"];
}

export interface ProjectCommand {
  type: "project";
  id: string;
  name: string;
  icon: string;
  workspaceName: string;
}

export interface ActionCommand {
  type: "action";
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export type Command = TodoCommand | ProjectCommand | ActionCommand;

export interface CommandGroup {
  label: string;
  commands: Command[];
}
