import { readLocalTodos, writeLocalTodos, generateId } from "@/lib/localStore";

/**
 * Local file/memory store operations (Replacing MongoDB).
 */
export async function getTodosCollection() {
  return {
    async find(query = {}) {
      const all = readLocalTodos();
      const filtered = all.filter((item) => matchQuery(item, query));
      return {
        sort(sortObj = {}) {
          const key = Object.keys(sortObj)[0] || "createdAt";
          const order = sortObj[key] === 1 ? 1 : -1;
          filtered.sort((a, b) => {
            if (a[key] > b[key]) return order;
            if (a[key] < b[key]) return -order;
            return 0;
          });
          return this;
        },
        skip(skipCount = 0) {
          filtered.splice(0, skipCount);
          return this;
        },
        limit(limitCount = 0) {
          if (limitCount > 0) {
            return {
              async toArray() {
                return filtered.slice(0, limitCount);
              },
            };
          }
          return this;
        },
        async toArray() {
          return filtered;
        },
      };
    },

    async countDocuments(query = {}) {
      const all = readLocalTodos();
      return all.filter((item) => matchQuery(item, query)).length;
    },

    async findOne(query = {}) {
      const all = readLocalTodos();
      return all.find((item) => matchQuery(item, query)) || null;
    },

    async insertOne(doc) {
      const all = readLocalTodos();
      const _id = generateId();
      const newDoc = { _id, ...doc };
      all.unshift(newDoc);
      writeLocalTodos(all);
      return { insertedId: _id };
    },

    async findOneAndUpdate(filter, update, options = {}) {
      const all = readLocalTodos();
      const index = all.findIndex((item) => matchQuery(item, filter));
      if (index === -1) return null;

      const current = all[index];
      const updated = {
        ...current,
        ...(update.$set || update),
        updatedAt: new Date().toISOString(),
      };
      all[index] = updated;
      writeLocalTodos(all);
      return updated;
    },

    async deleteOne(filter) {
      const all = readLocalTodos();
      const index = all.findIndex((item) => matchQuery(item, filter));
      if (index === -1) return { deletedCount: 0 };
      all.splice(index, 1);
      writeLocalTodos(all);
      return { deletedCount: 1 };
    },

    async deleteMany(filter) {
      const all = readLocalTodos();
      const remaining = all.filter((item) => !matchQuery(item, filter));
      const deletedCount = all.length - remaining.length;
      writeLocalTodos(remaining);
      return { deletedCount };
    },
  };
}

function matchQuery(item, query) {
  for (const [key, value] of Object.entries(query)) {
    if (key === "$or" && Array.isArray(value)) {
      const anyMatch = value.some((subQuery) => matchQuery(item, subQuery));
      if (!anyMatch) return false;
      continue;
    }
    if (key === "$and" && Array.isArray(value)) {
      const allMatch = value.every((subQuery) => matchQuery(item, subQuery));
      if (!allMatch) return false;
      continue;
    }
    if (key === "_id") {
      const targetId = String(value);
      if (String(item._id) !== targetId) return false;
      continue;
    }
    if (value && typeof value === "object" && value.$regex) {
      const re = new RegExp(value.$regex, value.$options || "");
      if (!re.test(item[key] || "")) return false;
      continue;
    }
    if (value && typeof value === "object" && value.$exists !== undefined) {
      const exists = item[key] !== undefined && item[key] !== null;
      if (exists !== value.$exists) return false;
      continue;
    }
    if (item[key] !== value) {
      return false;
    }
  }
  return true;
}

/**
 * Validates whether an ID is a valid string identifier.
 */
export function isValidObjectId(id) {
  if (!id || typeof id !== "string") return false;
  return id.length >= 6;
}

/**
 * Extracts a user/buddy identifier from request.
 */
export function getUserIdFromRequest(request, body = null) {
  if (body && (body.userId || body.user || body.buddy)) {
    const val = String(body.userId || body.user || body.buddy).trim();
    if (val) return val;
  }

  try {
    const { searchParams } = new URL(request.url);
    const paramUser = searchParams.get("userId") || searchParams.get("user") || searchParams.get("buddy");
    if (paramUser && paramUser.trim()) {
      return paramUser.trim();
    }
  } catch {}

  const headerUser =
    request.headers.get("x-user-id") ||
    request.headers.get("x-user") ||
    request.headers.get("x-buddy");
  if (headerUser && headerUser.trim()) {
    return headerUser.trim();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(?:next_todo_user|todo_user|userId)=([^;]+)/);
  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1]).trim();
    } catch {
      return match[1].trim();
    }
  }

  return null;
}

export const ObjectId = function (id) {
  return String(id);
};
