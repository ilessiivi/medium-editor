/*global describe, it, expect,
    afterEach, beforeEach, fireEvent, setupTestHelpers */

describe('Placeholder TestCase', function () {
    'use strict';

    beforeEach(function () {
        setupTestHelpers.call(this);
        this.el = this.createElement('div', 'editor', '');
    });

    afterEach(function () {
        this.cleanupTest();
    });

    it('should set placeholder for empty elements', function () {
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
    });

    it('should not set a placeholder for elements with text content', function () {
        this.el.innerHTML = 'some text';
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should not set a placeholder for elements with images only', function () {
        this.el.innerHTML = '<img src="foo.jpg">';
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should not set a placeholder for elements with unorderedlist', function () {
        this.el.innerHTML = '<ul><li></li></ul>';
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should not set a placeholder for elements with orderedlist', function () {
        this.el.innerHTML = '<ol><li></li></ol>';
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should set placeholder for elements with empty children', function () {
        this.el.innerHTML = '<p><br></p><div class="empty"></div>';
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
    });

    it('should remove the placeholder on keypress', function () {
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
        fireEvent(editor.elements[0], 'keypress');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should remove the placeholder on click', function () {
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
        fireEvent(editor.elements[0], 'click');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
        fireEvent(editor.elements[0], 'blur');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
        this.el.innerHTML = '<p>lorem</p><p id="target">ipsum</p><p>dolor</p>';
        fireEvent(document.getElementById('target'), 'click');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should add a placeholder to empty elements on blur', function () {
        this.el.innerHTML = 'some text';
        var editor = this.newMediumEditor('.editor');
        editor.elements[0].focus();
        fireEvent(editor.elements[0], 'focus');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
        editor.elements[0].innerHTML = '';
        fireEvent(document.querySelector('div'), 'click');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
    });

    it('should not add a placeholder to elements with text on blur', function () {
        var editor = this.newMediumEditor('.editor');
        expect(editor.elements[0].className).toContain('medium-editor-placeholder');
        editor.elements[0].innerHTML = 'some text';
        fireEvent(editor.elements[0], 'blur');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    /*jslint regexp: true*/
    function validatePlaceholderContent(element, expectedValue) {
        var placeholder = window.getComputedStyle(element, ':after').getPropertyValue('content'),
            regex = /^attr\(([^\)]+)\)$/g,
            match = regex.exec(placeholder);
        if (match) {
            // In firefox, getComputedStyle().getPropertyValue('content') can return attr() instead of what attr() evaluates to
            expect(match[1]).toEqual('data-placeholder');
        } else {
            expect(placeholder).toEqual('\'' + expectedValue + '\'');
        }
    }
    /*jslint regexp: false*/

    it('should add the default placeholder text when data-placeholder is not present', function () {
        var editor = this.newMediumEditor('.editor');
        validatePlaceholderContent(editor.elements[0], editor.options.placeholder);
    });

    it('should use the data-placeholder when it is present', function () {
        var editor,
            placeholderText = 'Custom placeholder';
        this.el.setAttribute('data-placeholder', placeholderText);
        editor = this.newMediumEditor('.editor');
        validatePlaceholderContent(editor.elements[0], placeholderText);
    });

    it('should not set placeholder for empty elements when disablePlaceholders is set to true', function () {
        var editor = this.newMediumEditor('.editor', {
            disablePlaceholders: true
        });
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });

    it('should not add a placeholder to empty elements on blur when disablePlaceholders is set to true', function () {
        this.el.innerHTML = 'some text';
        var editor = this.newMediumEditor('.editor', {
            disablePlaceholders: true
        });
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
        editor.elements[0].innerHTML = '';
        fireEvent(document.querySelector('div'), 'click');
        expect(editor.elements[0].className).not.toContain('medium-editor-placeholder');
    });
});
