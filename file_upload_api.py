// ... existing code ...
    import asyncio
    import json
    import os
    import shutil
    import uuid
    from collections import deque
    from datetime import datetime, timedelta, timezone
// ... existing code ...
    @app.post("/api/files/upload")
    async def upload_file(file: UploadFile = FastAPIFile(...)):
        """Upload file for pipeline processing"""
    
        # Create uploads directory if it doesn't exist
        uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
// ... existing code ...
