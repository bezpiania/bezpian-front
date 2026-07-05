import instance from '../apis/app.js';

class StatusService {
  getStatus = () => instance.get('/api/health');
}

const Status = new StatusService();
export default Status;
