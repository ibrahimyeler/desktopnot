import 'package:flutter/material.dart';
import 'login/login_colors.dart';

class CustomTextField extends StatefulWidget {
  final String label;
  final String hint;
  final IconData? icon;
  final bool isPassword;
  final TextEditingController controller;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final bool obscureText;
  final Widget? suffixIcon;
  final TextAlign textAlign;
  final TextStyle? style;
  final int? maxLength;
  final bool enabled;

  const CustomTextField({
    super.key,
    required this.label,
    required this.hint,
    this.icon,
    this.isPassword = false,
    required this.controller,
    this.validator,
    this.keyboardType,
    this.obscureText = false,
    this.suffixIcon,
    this.textAlign = TextAlign.left,
    this.style,
    this.maxLength,
    this.enabled = true,
  });

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField>
    with SingleTickerProviderStateMixin {
  bool _isObscured = true;
  bool _isFocused = false;
  late AnimationController _focusController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _focusController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _focusController,
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    _focusController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: LoginColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Focus(
          onFocusChange: (hasFocus) {
            setState(() {
              _isFocused = hasFocus;
            });
            if (hasFocus) {
              _focusController.forward();
            } else {
              _focusController.reverse();
            }
          },
          child: AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              return Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  // Shadow kaldırıldı
                ),
                child: TextFormField(
                  controller: widget.controller,
                  obscureText: widget.obscureText || (widget.isPassword && _isObscured),
                  validator: widget.validator,
                  keyboardType: widget.keyboardType,
                  textAlign: widget.textAlign,
                  style: widget.style ?? TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 16,
                  ),
                  maxLength: widget.maxLength,
                  enabled: widget.enabled,
                  decoration: InputDecoration(
                    hintStyle: TextStyle(
                      color: LoginColors.textSecondary.withOpacity(0.6),
                    ),
                    hintText: widget.hint,
                    prefixIcon: widget.icon != null
                        ? Icon(
                            widget.icon,
                            color: _isFocused
                                ? LoginColors.orangeBright
                                : LoginColors.textSecondary,
                          )
                        : null,
                    suffixIcon: widget.suffixIcon ?? (widget.isPassword
                        ? IconButton(
                            icon: Icon(
                              _isObscured
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                              color: LoginColors.textSecondary,
                            ),
                            onPressed: () {
                              setState(() {
                                _isObscured = !_isObscured;
                              });
                            },
                          )
                        : null),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(
                        color: _isFocused
                            ? LoginColors.orangeBright
                            : LoginColors.lightGray.withOpacity(0.3),
                        width: _isFocused ? 2 : 1,
                      ),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(
                        color: _isFocused
                            ? LoginColors.orangeBright
                            : LoginColors.lightGray.withOpacity(0.3),
                        width: _isFocused ? 2 : 1,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(
                        color: LoginColors.orangeBright,
                        width: 2,
                      ),
                    ),
                    filled: true,
                    fillColor: _isFocused
                        ? LoginColors.mediumGray
                        : LoginColors.mediumGray,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

