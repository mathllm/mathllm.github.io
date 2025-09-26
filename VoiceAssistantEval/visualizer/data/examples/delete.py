import os
import shutil
import random
from pathlib import Path

def delete_80_percent_subfolders(directory_path):
    """删除指定目录下80%的子文件夹"""

    # 转换为Path对象
    path = Path(directory_path)

    # 检查目录是否存在
    if not path.exists() or not path.is_dir():
        print(f"错误: {directory_path} 不存在或不是目录")
        return

    # 获取所有子文件夹
    subfolders = [item for item in path.iterdir() if
item.is_dir()]

    if not subfolders:
        print("没有找到子文件夹")
        return

    # 计算要删除的文件夹数量（80%）
    total_count = len(subfolders)
    delete_count = int(total_count * 0.8)

    print(f"总共发现 {total_count} 个子文件夹")
    print(f"将删除 {delete_count} 个子文件夹")

    # 随机选择要删除的文件夹
    folders_to_delete = random.sample(subfolders, delete_count)

    # 显示将要删除的文件夹
    print("\n将要删除的文件夹:")
    for folder in folders_to_delete:
        print(f"  - {folder.name}")

    # 确认删除
    confirm = input(f"\n确认删除这 {delete_count} 个文件夹吗？(y/N): ")

    if confirm.lower() == 'y':
        # 执行删除
        deleted_count = 0
        for folder in folders_to_delete:
            try:
                shutil.rmtree(folder)
                print(f"已删除: {folder.name}")
                deleted_count += 1
            except Exception as e:
                print(f"删除失败 {folder.name}: {e}")

        print(f"\n删除完成！成功删除 {deleted_count} 个文件夹")
    else:
        print("取消删除操作")

# 使用示例
if __name__ == "__main__":
    # 指定要处理的目录路径
    target_directory = "/mnt/cache/wangke_fz/mathllm.github.io/VoiceAssistantEval/visualizer/data/examples/Speaking/Safety"  # 当前目录，可以修改为其他路径
    delete_80_percent_subfolders(target_directory)