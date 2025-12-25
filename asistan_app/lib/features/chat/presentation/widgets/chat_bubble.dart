import 'package:flutter/material.dart';
import '../../domain/entities/chat_message.dart';
import '../../../../core/constants/app_constants.dart';

class ChatBubble extends StatelessWidget {
  final ChatMessage message;

  const ChatBubble({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment:
            message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!message.isUser) ...[
            CircleAvatar(
              radius: AppConstants.avatarRadius,
              backgroundColor: Colors.blue[100],
              child: const Icon(
                Icons.smart_toy,
                size: AppConstants.iconSize,
                color: Colors.blue,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: message.isUser
                    ? Theme.of(context).colorScheme.primary
                    : Theme.of(context).brightness == Brightness.dark
                        ? Colors.grey[800]
                        : Colors.grey[200],
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(AppConstants.chatBubbleBorderRadius),
                  topRight: const Radius.circular(AppConstants.chatBubbleBorderRadius),
                  bottomLeft: Radius.circular(
                    message.isUser
                        ? AppConstants.chatBubbleBorderRadius
                        : AppConstants.chatBubbleSmallBorderRadius,
                  ),
                  bottomRight: Radius.circular(
                    message.isUser
                        ? AppConstants.chatBubbleSmallBorderRadius
                        : AppConstants.chatBubbleBorderRadius,
                  ),
                ),
              ),
              child: Text(
                message.text,
                style: TextStyle(
                  color: message.isUser
                      ? Colors.white
                      : Theme.of(context).brightness == Brightness.dark
                          ? Colors.white
                          : Colors.black87,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          if (message.isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: AppConstants.avatarRadius,
              backgroundColor: Colors.blue[100],
              child: const Icon(
                Icons.person,
                size: AppConstants.iconSize,
                color: Colors.blue,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

