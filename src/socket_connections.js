class SocketConnections {
  static socketsMap = new Map();

  static newSocket(uid, socket, sessionID, socketID) {
    const old = this.socketsMap.get(uid);
    if (old) {
      Object.assign(old.sockets, { [socketID]: socket });
      return old.sessionID;
    }

    this.socketsMap.set(uid, {
      sockets: { [socketID]: socket },
      sessionID,
    });

    return sessionID;
  }

  static emitMessageOnSockets(uid, message) {
    const socket = this.socketsMap.get(uid);

    if (socket !== undefined) {
      Object.values(socket.sockets).forEach((s) => s.emit("message", message));
    } else {
      console.log("no item in map for user", uid);
    }
  }

  static removeSocket(uid, sid) {
    let socket = this.socketsMap.get(uid);
    if (socket.sockets.length == 1) {
      this.socketsMap.delete(uid);
    } else {
      delete socket.sockets[sid];
    }
  }
}

module.exports = SocketConnections;
