/**
 * SweetAlert2 loader & custom-styled helper matching shadcn/ui White Theme.
 */

declare global {
  interface Window {
    Swal: any;
  }
}

let swalPromise: Promise<any> | null = null;

export async function getSwal() {
  if (typeof window === "undefined") return null;
  if (window.Swal) return window.Swal;

  if (!swalPromise) {
    swalPromise = new Promise((resolve, reject) => {
      // Inject CSS if not already injected
      if (!document.getElementById("swal-theme-css")) {
        const link = document.createElement("link");
        link.id = "swal-theme-css";
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";
        document.head.appendChild(link);
      }

      // Inject JS if not already injected
      if (document.getElementById("swal-script")) {
        const checkInterval = setInterval(() => {
          if (window.Swal) {
            clearInterval(checkInterval);
            resolve(window.Swal);
          }
        }, 50);
        return;
      }

      const script = document.createElement("script");
      script.id = "swal-script";
      script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
      script.onload = () => {
        resolve(window.Swal);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  return swalPromise;
}

/**
 * Clean White / shadcn Toast notification
 */
export async function showToast(
  title: string,
  icon: "success" | "info" | "warning" | "error" = "success"
) {
  const Swal = await getSwal();
  if (!Swal) return;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    didOpen: (toast: HTMLElement) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    customClass: {
      popup: "rounded-xl border border-slate-200 bg-white text-slate-800 shadow-lg text-sm font-sans",
    },
  });

  Toast.fire({
    icon,
    title,
  });
}

/**
 * shadcn-styled confirmation dialog
 */
export async function confirmDelete(title = "Delete Task?", text = "This action cannot be undone.") {
  const Swal = await getSwal();
  if (!Swal) return false;

  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl font-sans text-slate-900",
      title: "text-lg font-semibold text-slate-900 mt-2",
      htmlContainer: "text-sm text-slate-500 mt-1",
      confirmButton: "px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm ml-2",
      cancelButton: "px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors border border-slate-200",
      actions: "gap-2 mt-4",
    },
  });

  return result.isConfirmed;
}

/**
 * Edit Todo Dialog with SweetAlert
 */
export async function promptEditTodo(todo: {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
}) {
  const Swal = await getSwal();
  if (!Swal) return null;

  const { value: formValues } = await Swal.fire({
    title: "Edit Task",
    html: `
      <div style="text-align: left; display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        <div>
          <label style="font-size: 12px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">Task Title</label>
          <input id="swal-edit-title" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box; height: 38px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px;" value="${todo.title.replace(/"/g, "&quot;")}" placeholder="Task title..." />
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">Description</label>
          <textarea id="swal-edit-desc" class="swal2-textarea" style="margin: 0; width: 100%; box-sizing: border-box; height: 60px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; resize: none;" placeholder="Description (optional)...">${(todo.description || "").replace(/"/g, "&quot;")}</textarea>
        </div>
        <div>
          <label style="font-size: 12px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">Priority</label>
          <select id="swal-edit-priority" style="width: 100%; height: 38px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0 12px; background: #fff; color: #0f172a;">
            <option value="low" ${todo.priority === "low" ? "selected" : ""}>Low Priority</option>
            <option value="medium" ${todo.priority === "medium" || !todo.priority ? "selected" : ""}>Medium Priority</option>
            <option value="high" ${todo.priority === "high" ? "selected" : ""}>High Priority</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl font-sans text-slate-900 max-w-md",
      title: "text-lg font-semibold text-slate-900",
      confirmButton: "px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shadow-sm ml-2",
      cancelButton: "px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors border border-slate-200",
      actions: "gap-2 mt-4",
    },
    preConfirm: () => {
      const titleInput = document.getElementById("swal-edit-title") as HTMLInputElement;
      const descInput = document.getElementById("swal-edit-desc") as HTMLTextAreaElement;
      const priorityInput = document.getElementById("swal-edit-priority") as HTMLSelectElement;

      if (!titleInput || !titleInput.value.trim()) {
        Swal.showValidationMessage("Title is required");
        return false;
      }

      return {
        title: titleInput.value.trim(),
        description: descInput ? descInput.value.trim() : "",
        priority: priorityInput ? priorityInput.value : "medium",
      };
    },
  });

  return formValues || null;
}

/**
 * Error alert modal
 */
export async function showError(title: string, text?: string) {
  const Swal = await getSwal();
  if (!Swal) return;

  Swal.fire({
    icon: "error",
    title,
    text: text || "Something went wrong. Please try again.",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl font-sans text-slate-900",
      title: "text-lg font-semibold text-slate-900",
      confirmButton: "px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium",
    },
  });
}

/**
 * Prompt to switch or set active Buddy / User Profile
 */
export async function promptSwitchUser(currentBuddy: string) {
  const Swal = await getSwal();
  if (!Swal) return null;

  const { value: newBuddy } = await Swal.fire({
    title: "Switch Buddy / User",
    html: `
      <div style="text-align: left; margin-top: 8px;">
        <p style="font-size: 13px; color: #64748b; margin-bottom: 12px; line-height: 1.5;">
          User-based isolation is enabled. <strong>Only tasks created by this Buddy are shown ("jo set kre usi ko dikhe")</strong>.
        </p>
        <label style="font-size: 12px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">
          Buddy / User Name
        </label>
        <input id="swal-user-input" class="swal2-input" style="margin: 0; width: 100%; box-sizing: border-box; height: 38px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px;" value="${currentBuddy.replace(/"/g, "&quot;")}" placeholder="e.g. Ajit, Rahul, Work, Personal, all" />
        <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="font-size: 11px; color: #94a3b8;">Suggestions:</span>
          <button type="button" onclick="document.getElementById('swal-user-input').value='Ajit'" style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #334155;">Ajit</button>
          <button type="button" onclick="document.getElementById('swal-user-input').value='Buddy-1'" style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #334155;">Buddy-1</button>
          <button type="button" onclick="document.getElementById('swal-user-input').value='Work'" style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #334155;">Work</button>
          <button type="button" onclick="document.getElementById('swal-user-input').value='all'" style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; color: #334155;">all (View All)</button>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Switch User",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl font-sans text-slate-900 max-w-md",
      title: "text-lg font-semibold text-slate-900",
      confirmButton: "px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shadow-sm ml-2",
      cancelButton: "px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors border border-slate-200",
      actions: "gap-2 mt-4",
    },
    preConfirm: () => {
      const input = document.getElementById("swal-user-input") as HTMLInputElement;
      if (!input || !input.value.trim()) {
        Swal.showValidationMessage("Please enter a username or 'all'");
        return false;
      }
      return input.value.trim();
    },
  });

  return newBuddy || null;
}

