For this problem, the checkboxes next to each todo on the todo list should be clickable. When you click on an empty box, it should mark that todo as done. Clicking an already-checked checkbox should mark that todo as not done. Your program should exhibit the following behaviors:

When you click a box, the screen should automatically redraw itself. DONE
Done todos should have a checkmark in the checkbox; undone todos should not have a checkmark. DONE
Done todos should be grayed out with a strikethrough; undone todos should display normally. DONE
When all todo lists are marked done, the todo list title should appear grayed out with a strikethrough. DONE
When all todo lists are marked done, the Complete All button should not be displayed.
In the list of todo lists at http://localhost:3000/lists, the modified todo list should show the new remaining todos counts. When all todos in the list are done, the todo list should show up as done.
At all times, the todos should be sorted alphabetically with done todos at the bottom.
Most of these actions should occur automatically without any additional code. Once you hook up the checkboxes to respond to clicks and toggle the completion status, the Pug view and CSS should handle the remaining behaviors.

You should also issue a flash success message after toggling a todo's completion status.

Make sure your code issues a 404 status code if either the requested todo list or the specified todo does not exist.

---------------
When you click a box, the screen should automatically redraw itself.
ALGORITHM:
1. Toogle the todo.
  1.1. post request to /lists/1/todos/4/toggle === /lists/:todoListId/todos/:todoId/toogle
  1.2. Retrieve the list using todoListId.
  1.3. Retrieve the todo using todoId.
  1.4. Toogle the status of the todo.
2. Refresh the page.
  2.1. Render /lists/:todoListId. Redirect to app.get(...) ?

------------------------

Practice Problem 2: Delete a Todo

For this problem, the trash can icons on the right side of the screen should be clickable. When you click on a trash can, it should remove the todo from the todo list and delete it. Your program should exhibit the following behaviors:

When you click a trash can, the screen should automatically redraw itself.
Deleted todos should not appear on the redrawn screen.
You should be able to delete both done and undone todos.
When all todo lists are deleted or marked done, the Complete All button should not be displayed.
In the list of todo lists at http://localhost:3000/lists, the modified todo list should show the new counts. Once you've deleted all of the undone, the todo list should show up as a done todo list.
At all times, the todos should remain sorted properly.
Most of these actions occur automatically without any additional code. Once you hook up the trash can icons to respond to clicks and delete todos, the Pug view and CSS should handle the remaining behaviors.

As with Problem 1, make sure your code issues a 404 status code if either the requested todo list or the specified todo does not exist.

You should also issue a flash success message after deleting a todo.