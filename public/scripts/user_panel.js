async function removeUser(userId) {
  const result = await fetch("http://localhost:6199/users/remove-user", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  });

  if (result.ok) {
    const row = document.getElementById(`row-${userId}`);
    if (row) {
      row.remove();
    }
  }
}

const checkBoxes = document.querySelectorAll("input[type=checkbox]");

async function updateRole(userId, roleId) {
  checkBox = document.getElementById(`${userId}-${roleId}`);

  checkBox.checked ? addRole(userId, roleId) : removeRole(userId, roleId);
}

async function addRole(userId, roleId) {
  const result = await fetch("http://localhost:6199/users/add-role", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      role_id: roleId,
    }),
  });
  return await result.json();
}

async function removeRole(userId, roleId) {
  const result = await fetch("http://localhost:6199/users/remove-role", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      role_id: roleId,
    }),
  });
  return await result.json();
}
